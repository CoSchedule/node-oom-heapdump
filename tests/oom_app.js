let path = require('path');

let oom = require("../index.js")({
    path: path.resolve(__dirname, 'my_heapdump'),
    OOMImplementation: "GC_MONITORING", // use the old implementation
    heapdumpOnOOM: true,
    addTimestamp: true,
    oomAfterHeapSnapshotHandler: (path) => {
      console.error('This is oomAfterHeapSnapshotHandler:', path);
      return new Promise((resolve) => setTimeout(() => {
        console.error('This is oomAfterHeapSnapshotHandler resolving:', path);
        resolve();
      }, 5000))
    }
});

// It is important to use named constructors (like the one below), otherwise
// the heap snapshots will not produce useful outputs for you.
function LeakingClass1() {
}

var leaks = [];
var handle = setInterval(function () {
    for (var i = 0; i < 100000; i++) {
        leaks.push(new LeakingClass1);
    }

    console.error('Leaks: %d', leaks.length);
}, 50);