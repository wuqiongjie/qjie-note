let dataList = [{
  "orgId": 1,
  "orgName": "校长办公室1",
  "parentId": 0,
  "children": [{
      "orgId": 2,
      "orgName": "校长办公室2",
      "parentId": 1,
      "children": [{
          "orgId": 3,
          "orgName": "校长办公室3",
          "parentId": 2,
      }]
  }]
}, {
  "orgId": 4,
  "orgName": "校长办公室1",
  "parentId": 0,
  "children": [{
    "orgId": 5,
    "orgName": "校长办公室2",
    "parentId": 4,
  }]
}]

let stack = []; // 栈维护
let isFind = false; // 找到的标志

function findParent(dataList, aimId) {
  if(dataList instanceof Array) {
    for(let i = 0; i < dataList.length; i++) {
      let tempData = dataList[i];
      if(isFind) break;
      if(tempData.orgId === aimId) {
        isFind = true;
        break;
      }else {
        if(tempData.children != null && tempData.children.length) {
          stack.push(tempData);
          findParent(tempData.children, aimId);
          if(!isFind) {
            stack.pop();
          }
        }
      }
    }
  }
}

findParent(dataList, 3);
