const EventEmitter = require('events');

/**
 * Practical 10: TaskEvents
 * Extends Node.js native EventEmitter to provide a decoupled,
 * non-blocking asynchronous event bus for background processing.
 */
class TaskEvents extends EventEmitter {}

// Export singleton instance
const taskEvents = new TaskEvents();

module.exports = taskEvents;
