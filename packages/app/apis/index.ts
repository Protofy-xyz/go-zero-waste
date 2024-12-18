import {Protofy} from 'protobase'
import correct_depositationApi from "./correct_depositation";
import double_check_depositationApi from "./double_check_depositation";
import incorrect_depositationApi from "./incorrect_depositation";
import clearApi from "./clear";
import create_machineApi from "./create_machine";
import correct_depositation_fsmApi from "./correct_depositation_fsm";

const autoApis = Protofy("apis", {
    correct_depositation: correct_depositationApi,
    double_check_depositation: double_check_depositationApi,
    incorrect_depositation: incorrect_depositationApi,
    clear: clearApi,
    create_machine: create_machineApi,
    correct_depositation_fsm: correct_depositation_fsmApi
})

export default (app, context) => {
    Object.keys(autoApis).forEach((k) => {
        autoApis[k](app, context)
    })
}