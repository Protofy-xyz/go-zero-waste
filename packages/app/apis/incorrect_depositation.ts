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
      name: "incorrect_depositation",
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
          "incorrect_button",
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
                  message: "Button pressed: INCORRECT!",
                  level: "info",
                  done: async () => {
                    let test = {
                      effect: "None",
                      color_mode: "rgb",
                      state: "ON",
                      brightness: 200,
                      color: {
                        r: 255,
                        g: 46,
                        b: 0,
                      },
                    };
                    await context.deviceAction(
                      "go_zero_waste1",
                      "feedback_leds",
                      "on",
                      JSON.stringify(test),
                      null,
                      null,
                      null
                    );
                    await context.deviceAction(
                      "go_zero_waste1",
                      "buzzer",
                      "set_pwm_percentage",
                      50,
                      async () => {
                        done();
                        setTimeout(
                          async () =>
                            await context.fetch(
                              "get",
                              "/api/v1/automations/clear",
                              null,
                              null,
                              null,
                              false,
                              undefined
                            ),
                          5000
                        );
                      },
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