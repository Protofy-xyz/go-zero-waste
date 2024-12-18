/*

app is an express object, you can use app.get/app.post to create new endpoints
you can define newendpoints like:

app.get('/api/v1/testapi', (req, res) => {
    //you code goes here
    //reply with res.send(...)
})

the session argument is a session object, with the following shape:
{
    user: { admin: boolean, id: string, type: string },
    token: string,
    loggedIn: boolean
}

use the chat if in doubt
*/

import { getAuth } from "protonode";
import { API, Protofy, getLogger } from "protobase";
import { APIContext } from "protolib/bundles/apiContext";
import { Application } from "express";
import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "..", "..");
const logger = getLogger();

Protofy("type", "CustomAPI");

export default Protofy(
  "code",
  async (app: Application, context: typeof APIContext) => {
    //PUT YOUR API HERE
    //context.deviceAction function allows to communicate with devices via mqtt
    //context.deviceSub allows to receive notifications from devices via mqtt
    //app is a normal expressjs object
    //context.mqtt is a mqttclient connection
    context.automations.automation({
      name: "clear",
      responseMode: "wait",
      app: app,
      onRun: async (params, res) => {
        await context.deviceAction(
          "go_zero_waste1",
          "feedback_leds",
          "off",
          undefined,
          null,
          null
        );
        await context.deviceAction(
          "go_zero_waste1",
          "buzzer",
          "set_pwm_percentage",
          0,
          null,
          null
        );
        await context.deviceAction(
          "go_zero_waste1",
          "door",
          "set_position",
          180,
          null,
          null
        );
      },
    });
  }
);
