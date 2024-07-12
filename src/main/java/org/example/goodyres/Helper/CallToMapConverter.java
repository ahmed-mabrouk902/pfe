package org.example.goodyres.Helper;


import org.example.goodyres.Entity.Call;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class CallToMapConverter implements Converter<Call, Map<String, Object>> {

  @Override
  public Map<String, Object> convert(Call call) {
    Map<String, Object> properties = new HashMap<>();
    properties.put("startNode", call.getIssuer());
    properties.put("endNode", call.getTarget());
    properties.put("type", call.getType());
    properties.put("topic", call.getTopic());
    properties.put("eventProduced", call.getEventProduced());
    properties.put("api", call.getApi());
    properties.put("description", call.getDescription());
    return properties;
  }
}
