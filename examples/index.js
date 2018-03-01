/***********************
 *  CUSTOM TEMPLATES   *
 ***********************/

var myTemplateConfig = {
  orientation: "vertical-reverse",
  colors: ["#F00", "#0F0", "#00F"], // branches colors, 1 per column
  branch: {
    lineWidth: 8,
    // Dash segments, see:
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
    lineDash: [5, 3],
    spacingX: 50
  },
  commit: {
    spacingY: -80,
    dot: {
      size: 12,
      lineDash: [4]
    },
    message: {
      display: true,
      displayAuthor: true,
      displayBranch: true,
      displayHash: false,
      font: "normal 12pt Arial"
    },
    shouldDisplayTooltipsInCompactMode: true, // default = true
    tooltipHTMLFormatter: function (commit) {
      return "<b>" + commit.sha1 + "</b>" + ": " + commit.message;
    }
  }
};
var myTemplate = new GitGraph.Template(myTemplateConfig);

/***********************
 *    INITIALIZATION   *
 ***********************/

var config = {
  template: "metro", // could be: "blackarrow" or "metro" or `myTemplate` (custom Template object)
  reverseArrow: false, // to make arrows point to ancestors, if displayed
  orientation: "horizontal",
  // mode: "compact" // special compact mode: hide messages & compact graph
};
var gitGraph = new GitGraph(config);

/************************
 * BRANCHES AND COMMITS *
 ************************/

// Create branch named "master"
var master = gitGraph.branch({
  name: "master",
  column: 3, 
  color: "#17BEBB",
  commitDefaultOptions: {
    dotColor: "black",
    messageColor: "#17BEBB",
    tagColor: "#17BEBB"
  }
  });

master.commit();

let develop = master.branch({
  name: "develop",
  column: 4,
  color: "#E0CA3C",
  commitDefaultOptions: {
    dotColor: "black",
    tagColor: "#E0CA3C",
    messageColor: "#E0CA3C",
  }
});

develop.commit({
  tag: "1.0.0",
  displayTagBox: true,
});

let feature1 = develop.branch({
  name: "feature/1",
  column: 6,
  color: "#CA61C3",
  commitDefaultOptions: {
    dotColor: "black",
    messageColor: "#CA61C3",
    tagColor: "#CA61C3",
  }
});
let feature2 = develop.branch({
  name: "feature/2",
  column: 7,
  color: "#CA61C3",
  commitDefaultOptions: {
    dotColor: "black",
    messageColor: "#CA61C3",
    tagColor: "#CA61C3",
  }
});

feature1
  .commit({
    color: "orange",
    displayTagBox: false,
  })
  .commit({
    color: "orange",
    displayTagBox: false,
  })

feature2.commit({
  color: "orange",
  displayTagBox: false,
})

feature1.merge(develop, {
  tag: "2.0.0",
})

let release1 = develop.branch({
  name: "release/v2.0.0",
  column: 5,
  color: "#4CB944",
  commitDefaultOptions: {
    dotColor: "black",
    messageColor: "#4CB944",
  }
});
release1.commit({
  lineDash: [3, 2],
  dotStrokeWidth: 5,
  dotColor: "white",
  tag: "2.0.0",
  displayTagBox: false,
  message: "Testing for release v1.0.1",
});
release1.merge(master, {
  tag: "v2.0.0",
  fastForward: true,
});
develop.merge(feature2, {
  color: "orange",
  message: "Backpull updated develop into feature.",
  displayTagBox: false,
})

feature2.commit({
  color: "orange",
  displayTagBox: false,
})

feature2.merge(develop, {
  message: "Merge feature/2 into develop.",
  tag: "2.1.0",
})

let release2 = develop.branch({
  name: "release/v2.1.0",
  column: 4,
  color: "#4CB944",
  column: release1.column,
  commitDefaultOptions: {
    dotColor: "black",
    tagColor: "#4CB944",
    messageColor: "#4CB944",
  },
})

release2
  .commit({
    lineDash: [3, 2],
    dotStrokeWidth: 5,
    dotColor: "white",
    tag: "2.1.0",
    displayTagBox: false,
    message: "Testing for release v1.2.0",
  });

release2.merge(master, {
  tag: "v2.1.0",
  displayTagBox: true,
});

let prodution1 = master.branch({
  name: "production/v2.1.0",
  column: 2,
  color: "#E55934",
  commitDefaultOptions: {
    dotColor: "black",
    messageColor: "#E55934",
    tagColor: "#E55934",
  }
})
prodution1.commit({
  lineDash: [3, 2],
  color: "red",
  tag: "2.1.0",
  displayTagBox: false,
  message: "Testing for release v1.2.0",
});

let hotfix1 = prodution1.branch({
  name: "hotfix/2.1.1",
  column: 1,
  color: "red",
  commitDefaultOptions: {
    dotColor: "black",
    messageColor: "red",
    tagColor: "red",
  },
});
hotfix1.commit({
  message: "Hotfix for production version 1.2",
  tag: "2.1.1",
});
hotfix1.merge(prodution1, {
  message: "Merge hotfix/1.2.1 into production/1.2.0",
  tag: "v2.1.1",
});
prodution1.merge(master, {
  message: "Merge production/1.2.1 into master.",
  tag: "v2.1.1",
});
master.merge(develop, {
  message: "Merge master into develop.",
  displayTagBox: false,
});
