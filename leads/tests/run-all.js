// Runs every mock test: node leads/tests/run-all.js   (needs the leaflet branch: git fetch origin claude/brave-allen-i14xnx, or LEAFLET_DIR=...)
"use strict";
require("./test-names");
require("./test-router");
require("./test-handlelead");
require("./test-checks");
require("./test-round2");
require("./review-bugs");
require("./harness").run();
