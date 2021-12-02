// Anything exported from this file is importable by other in-browser modules.
import { ReplaySubject } from 'rxjs'

export function sayHello(who) {
  console.log(`%c${who} sayHello`, 'color:skyblue');
}

export const sharedSubject = new ReplaySubject();