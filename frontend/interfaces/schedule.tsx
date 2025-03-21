export interface FixedLengthArray extends Array<boolean> {
  length: 7,
  [index: number]: boolean
}

export interface ExampleData {
  time: number, // either hour or offset from sunrise/sunset represented in seconds
  auto: boolean, // if true, time represents offset from sunrise or sunset
  action: "turn-on" | "turn-off",
  repeats: FixedLengthArray // when the action should take place, starts from sunday
}