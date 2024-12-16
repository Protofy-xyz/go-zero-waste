import {Protofy} from 'protobase'
import sampleMachine from './sampleMachine'
import goZeroWaste from "./goZeroWaste";

export default Protofy("machines", {
    sampleMachine,
    goZeroWaste: goZeroWaste
})