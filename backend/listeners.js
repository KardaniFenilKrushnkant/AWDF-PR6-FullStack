const taskEvents = require('./events');

/**
 * Event Listeners Registration
 * Demonstrates decoupled background processing without blocking the API request-response cycle.
 */

// 1. Task Created Listener (Simulates 2-second background email/push notification)
taskEvents.on('task-created', (task) => {
  try {
    const receivedTime = new Date().toISOString();
    const assignedUser = task.assignedTo || 'Fenil Kardani (D25IT136)';
    console.log(`[Notification Service] Event 'task-created' received for "${task.title}" | Assigned: ${assignedUser} | Timestamp: ${receivedTime}`);

    if (task.simulateError) {
      throw new Error(`Simulated notification failure for task "${task.title}"`);
    }

    // Simulate heavy background work (e.g. sending SMTP email / webhook dispatch with 2-second delay)
    setTimeout(() => {
      const completionTime = new Date().toISOString();
      console.log(`[Notification Service] ✓ Background email dispatched for "${task.title}" | Assigned: ${assignedUser} | Finished at: ${completionTime} (+2000ms async non-blocking delay)`);
    }, 2000);

  } catch (err) {
    // Supplementary Problem 2: Emit error event
    taskEvents.emit('error', err);
  }
});

// 2. Supplementary Problem 1: Task Deleted Listener
taskEvents.on('task-deleted', (task) => {
  const timestamp = new Date().toISOString();
  console.log(`[Audit Service] Event 'task-deleted' logged for "${task.title}" (ID: ${task._id || 'N/A'}) at ${timestamp}`);
});

// 3. Supplementary Problem 2: Error Event Listener
taskEvents.on('error', (err) => {
  const timestamp = new Date().toISOString();
  console.error(`[Error Monitor] ⚠️ Handled background error safely at ${timestamp}: ${err.message}`);
});

console.log('[Event Bus] All EventEmitter background listeners successfully registered');

module.exports = taskEvents;
