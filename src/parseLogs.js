function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

// Read in a log file and parse it into a JSON object
// Log file will be in the format: [timestamp] [message] \n
module.exports = function parseLog(log) {
    const lines = log.split('\n');
    const parsed = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().length === 0) {
            continue;
        }
        let timestamp = null
        let message = null
        try {
            const splitIdx = line.indexOf(" ")
            if (splitIdx >= 0) {
                timestamp = new Date(line.slice(0, splitIdx))
                message = line.slice(splitIdx + 1)
            } else {
                timestamp = new Date(line)
            }
            parsed.push({
                _timestamp: timestamp.toISOString(),
                message
            });
        } catch (e) {
            console.log("Bad datetime", e)
        }
    }
    return parsed;
}