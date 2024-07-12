package org.example.goodyres.Repositories;



import org.example.goodyres.Entity.Call;
import org.example.goodyres.Entity.MyNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.Set;
@EnableNeo4jRepositories(considerNestedRepositories = true)
public interface SharedRepository extends Neo4jRepository<MyNode, String> {
  @Query("MATCH (n) RETURN n.name as name")
  public Set<String> getAllNames();

  @Query("MATCH (i:MyNode)-[r]->(t:MyNode) RETURN r.id AS id , i.name AS issuer , t.name AS target,  r.type AS type , r.topic AS topic , r.eventProduced AS eventProduced , r.api AS api , r.description AS description")
  public List<Call> findAllCalls();
  @Query("MATCH (i:MyNode)-[r]->(t:MyNode)\n" +
          "WHERE i.name = $startNode AND t.name = $endNode\n" +
          "RETURN r.id AS id, i.name AS issuer, t.name AS target, r.type AS type, r.topic AS topic, r.eventProduced AS eventProduced, r.api AS api, r.description AS description")
  public Call findCall(String startNode,String endNode);



  @Query(" MATCH (a:MyNode), (b:MyNode)\n" +
          "WHERE a.name = $startNode AND b.name = $endNode\n" +
          "CREATE (a)-[r:CALLS ]->(b)\n" +
          "SET r.id = ID(r) , r.type = $type, r.topic = $topic , r.eventProduced = $eventProduced , r.api = $api , r.description = $description\n" +
          "RETURN r")
  public Call addCall(String startNode
          , String endNode,
                      String type,
                      String topic,
                      String eventProduced,
                      String api,
                      String description);

  @Query("MATCH ()-[r]->()\n" +
          "WHERE r.id = $id\n" +
          "SET  r.type = $type, r.topic = $topic , r.eventProduced = $eventProduced , r.api = $api , r.description = $description\n" +
          "RETURN r"
  )
  public Call updateCall(Long id, String type, String topic, String eventProduced, String api,
                         String description);

  @Query("MATCH ()-[r]->()\n" +
          "WHERE r.id = $id\n" +
          "DELETE r")
  public void deleteCall(Long id);

  @Query("MATCH ()-[r]->()\n" +
          "DELETE r")
  public void deleteAllCalls();

  @Query("UNWIND $calls AS call " +
          "MERGE (a:MyNode { name: call.startNode }) " +
          "MERGE (b:MyNode { name: call.endNode }) " + //ken les deux noeuds exist donc retrieve sinon tsir creation
          "WITH call, a, b " + //to chain the query parts together
          "OPTIONAL MATCH (a)-[r:CALLS]->(b) " + //finding existing relationship
          "WHERE r.type = call.type " + // ensure to have same type
          "FOREACH (ignore IN CASE WHEN r IS NULL THEN [1] ELSE [] END | " +//for each null relationship we create new one
          "  CREATE (a)-[newR:CALLS]->(b) " +
          "  SET newR.id = ID(newR), newR.type = call.type, newR.topic = call.topic, " +
          "  newR.eventProduced = call.eventProduced, newR.api = call.api, " +
          "  newR.description = call.description " +
          ") " +
          "FOREACH (ignore IN CASE WHEN r IS NOT NULL THEN [1] ELSE [] END | " + //ignore if found and update with call properties
          "  SET r.id = ID(r), r.topic = call.topic, r.eventProduced = call.eventProduced, " +
          "  r.api = call.api, r.description = call.description " +
          ")"
  )
  void addCalls(@Param("calls") List<Map<String, Object>> calls);


  @Query(//Unwind take individual call
          // look for StartNode and EndNode from MyNodeEntity
          // matching all together WITH call,a,b
          // retrieve node when call having a null or b null
          "UNWIND $calls AS call " +
                  "OPTIONAL MATCH (a:MyNode {name: call.startNode}) " +
                  "OPTIONAL MATCH (b:MyNode {name: call.endNode}) " +
                  "WITH call, a, b " +
                  "WHERE a IS NULL OR b IS NULL " +
                  "RETURN call.startNode + ' -> ' + call.endNode AS unmatchedNodes"
  )
  Set<String> getUnmatchedNodes(@Param("calls") List<Map<String, Object>> calls);




}
