'use strict';

/* Filters */

var filters = angular.module('filters', []);


filters.filter('displayTxStatus', function() {
  return function(value) {
    return ["处理中", "处理中", "成功", "失败"][value];
  }
});

