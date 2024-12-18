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
    context.onEvent(
      context.mqtt,
      context,
      async (event) =>
        await context.sm.emitToStateMachine({
          instanceName: "go_zero_waste_machine",
          emitType: "qr_detected",
        }),
      "binary_sensor/incorrect_button/state",
      "device"
    );
    await context.sm.onStateMachineEvent({
      context: context,
      mqtt: context.mqtt,
      instanceName: "go_zero_waste_machine",
      state: "reading",
      onEventCb: async (event) => {
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
              "9abf56f7-e76e-483a-9417-3d4de62f7f91",
              null,
              async (value) => {
                await context.sm.emitToStateMachine({
                  instanceName: "go_zero_waste_machine",
                  emitType: "qr_is_correct",
                });
              }
            )
        );
      },
    });
    await context.sm.onStateMachineEvent({
      context: context,
      mqtt: context.mqtt,
      instanceName: "go_zero_waste_machine",
      state: "double_check",
      onEventCb: async (event) => {
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
          "feedback_leds",
          "on",
          JSON.stringify(test)
        );
        await context.deviceAction(
          "go_zero_waste1",
          "door",
          "set_position",
          60,
          async () =>
            context.fetch(
              "get",
              "/api/v1/automations/double_check_depositation",
              null,
              async (data) =>
                await context.sm.emitToStateMachine({
                  instanceName: "go_zero_waste",
                  emitType: "double_check_true",
                }),
              null,
              false,
              undefined
            ),
          null
        );
      },
    });
  }
);
