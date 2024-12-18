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
      name: "correct_depositation",
      responseMode: "wait",
      app: app,
      onRun: async (params, res) => {
        await context.deviceAction(
          "go_zero_waste1",
          "feedback_leds",
          "on",
          undefined,
          null,
          null
        );
        context.deviceSub(
          context.mqtt,
          context,
          "go_zero_waste1",
          "correct_button",
          "status",
          async (message, topic, done) =>
            context.flow.edgeDetector(
              message,
              "ON",
              "OFF",
              "f9a4a925-d169-4464-86ae-8fd1e1c07b11",
              null,
              async (value) =>
                await context.logs.log({
                  message: "Button pressed: CORRECT!",
                  level: "info",
                  done: async () => {
                    let test = {
                      effect: "None",
                      color_mode: "rgb",
                      state: "ON",
                      brightness: 200,
                      color: {
                        r: 0,
                        g: 255,
                        b: 62,
                      },
                    };
                    await context.deviceAction(
                      "go_zero_waste1",
                      "door",
                      "set_position",
                      60,
                      async () =>
                        await context.logs.log({
                          message: "DOOR OPEN",
                          level: "info",
                        }),
                      null
                    );
                    await context.deviceAction(
                      "go_zero_waste1",
                      "feedback_leds",
                      "on",
                      JSON.stringify(test),
                      async () =>
                        context.fetch(
                          "get",
                          "/api/v1/automations/double_check_depositation",
                          null,
                          async (data) => {
                            done();
                          },
                          null,
                          false,
                          undefined
                        ),
                      null,
                      null
                    );
                  },
                })
            )
        );
      },
    });
  }
);
