import { Memory } from './Memory';
import { Parser } from './Parser';

const memory = new Memory(0x2);
const parser = new Parser();

parser.parse('0x000F --> 0x0010 [+] 0x0001', memory);

memory.output();