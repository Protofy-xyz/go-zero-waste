import { Protofy } from 'protobase'
import { generateEvent } from "protolib/bundles/events/eventsLibrary";
import { getServiceToken } from "protonode";
import { assign } from "protolib/bundles/stateMachines/handlers";

/*
    Generated State Machine definition from
    template. State Machines bundle supports  
    XState createMachine function object syntax, 
    look at `https://www.jsdocs.io/package/xstate#createMachine`
    
    Each `params` is an object with the 
    following keys. 
      - instanceName: name of the spawned machine based in definition
      - context: all api context functions
*/ 

export default Protofy("machineDefinition", {
  context: {
    "counter": "0"
}, 
  initial: "idle", 
  states: {
    idle: {
      entry: async (params) => {
        await generateEvent(
          {
              path: "stateMachines/state/entry",
              from: "state-machine",
              user: params.instanceName,
              payload: {
                machine: params.instanceName, 
                definition: "goZeroWaste", 
                currentState: "idle"
              }
          },
          getServiceToken()
        );
      }
    }, 
    reading: {
      entry: async (params) => {
        await generateEvent(
          {
              path: "stateMachines/state/entry",
              from: "state-machine",
              user: params.instanceName,
              payload: {
                machine: params.instanceName, 
                definition: "goZeroWaste", 
                currentState: "reading"
              }
          },
          getServiceToken()
        );
      }
    }, 
    success: {
      entry: async (params) => {
        await generateEvent(
          {
              path: "stateMachines/state/entry",
              from: "state-machine",
              user: params.instanceName,
              payload: {
                machine: params.instanceName, 
                definition: "goZeroWaste", 
                currentState: "success"
              }
          },
          getServiceToken()
        );
      }
    }, 
    error: {
      entry: async (params) => {
        await generateEvent(
          {
              path: "stateMachines/state/entry",
              from: "state-machine",
              user: params.instanceName,
              payload: {
                machine: params.instanceName, 
                definition: "goZeroWaste", 
                currentState: "error"
              }
          },
          getServiceToken()
        );
      }
    }, 
  },
  on: {}
})

