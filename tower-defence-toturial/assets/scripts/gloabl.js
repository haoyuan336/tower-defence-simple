/**
 * Created by chu on 2017/10/10 0010.
 */
import EventListener from './event-listener'
const global = global || {};
global.event = EventListener({});
export default global;