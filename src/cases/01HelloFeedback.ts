import { ChartDataSets, ChartData } from 'chart.js';
import { constantSetpoint, invert, defaultOutput, System, Block, DataRecorder, connect, loop } from "../engine/System";
import { ProportionalBlock } from '../engine/Controller';

class Buffer implements Block {
  private recorder: DataRecorder = new DataRecorder('buffer size', 'rgba(255,0,0,0.5)');
  private buffer: number = 0;
  step(at: number, dt: number, input: number): number {
    input |= 0;
    this.buffer += input;
    // consumed rundomly
    this.buffer -= Math.random() * 10;
    this.buffer = Math.max(0, this.buffer);
    // record
    this.buffer |= 0;
    this.recorder.record(this.buffer);
    return this.buffer;
  }
  get inspect(): ChartDataSets[] {
    return [];
  }
}

export default function helloFeedback(): ChartData {
  const input = constantSetpoint(1000);
  const forward = (()=>{
    const controller = new ProportionalBlock(1.5);
    const plant = new Buffer();
    return connect(controller, plant);
  })();
  const block = loop(forward, invert());
  const output = defaultOutput();
  const system = new System(input, block, output);
  return system.exec(1, 30);
}
