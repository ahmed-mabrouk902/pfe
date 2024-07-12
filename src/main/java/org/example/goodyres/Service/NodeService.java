package org.example.goodyres.Service;


import org.example.goodyres.Entity.MyNode;
import org.example.goodyres.Repositories.SharedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service

public class NodeService {
  @Autowired
  SharedRepository sharedRepository;


  /**
   * Add a microservice to database
   *
   * @param
   * @param name
   */
  public MyNode add(String name, String type) {
    if (!sharedRepository.existsById(name)) {
      MyNode newNode = new MyNode(name, type);
      return this.sharedRepository.save(newNode);
    }else{ throw  new RuntimeException("the name already exist!");}
//    return null;
  }

  public List<MyNode> addAll(List<MyNode> nodes) {
    return this.sharedRepository.saveAll(nodes);
  }

  /**
   * Get one microservice by name
   *
   * @param name
   * @return
   */
  public MyNode getByName(String name) {
    return this.sharedRepository.findById(name).orElse(null);
  }

  public Set<String> getName() {
    return sharedRepository.getAllNames();
  }

  /**
   * Get all microservices in database
   *
   * @return
   */
  public List<MyNode> getAll() {
    return this.sharedRepository.findAll();
  }

  /**
   * delete a microservice
   *
   * @param name
   */
  public void delete(String name) {

    this.sharedRepository.deleteById(name);

  }

  /**
   * Delete all nodes
   */
  public void deleteAll() {
    this.sharedRepository.deleteAll();
  }



}
