package org.example.goodyres.Controller;


import org.example.goodyres.Entity.MyNode;
import org.example.goodyres.Service.NodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/node")

public class NodeController {
  @Autowired
  NodeService nodeService;


  @GetMapping
  public List<MyNode> getAll() {
    return this.nodeService.getAll();
  }


  @GetMapping("/names")
  public Set<String> getAllNames() {
    return this.nodeService.getName();
  }

  @GetMapping("{name}")
  public MyNode getByName(@PathVariable String name) {
    return this.nodeService.getByName(name);
  }

  @PostMapping
  @PreAuthorize("hasRole('client_admin')")
  public MyNode add(@RequestPart("name") String name,
                    @RequestPart(value = "type") String type

  ) {
    return this.nodeService.add(name, type);
  }

  @DeleteMapping("/{name}")
  @PreAuthorize("hasRole('client_admin')")
  public void delete(@PathVariable String name) {
    this.nodeService.delete(name);
  }

  @DeleteMapping()
  @PreAuthorize("hasRole('client_admin')")
  public void deleteAll() {
    this.nodeService.deleteAll();
  }


}
