(function() {
  var $, Traslator, container, injector,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Traslator = (function() {
    var decodeHtml;

    Traslator.prototype._htmlPositions = [];

    Traslator.prototype._textPositions = [];

    Traslator.prototype._html = '';

    Traslator.prototype._text = '';

    decodeHtml = function(html) {
      var txt;
      txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    };

    Traslator.create = function(html) {
      var traslator;
      traslator = new Traslator(html);
      traslator.parse();
      return traslator;
    };

    function Traslator(html) {
      this._html = html;
    }

    Traslator.prototype.parse = function() {
      var htmlElem, htmlLength, htmlPost, htmlPre, htmlProcessed, match, pattern, ref, textLength, textPost, textPre;
      this._htmlPositions = [];
      this._textPositions = [];
      this._text = '';
      pattern = /([^&<>]*)(&[^&;]*;|<[^>]*>)([^&<>]*)/gim;
      textLength = 0;
      htmlLength = 0;
      while (match = pattern.exec(this._html)) {
        htmlPre = match[1];
        htmlElem = match[2];
        htmlPost = match[3];
        textPre = htmlPre + ((ref = htmlElem.toLowerCase()) === '</p>' || ref === '</li>' ? '\n\n' : '');
        textPost = htmlPost;
        textLength += textPre.length;
        if (/^&[^&;]*;$/gim.test(htmlElem)) {
          textLength += 1;
        }
        htmlLength += htmlPre.length + htmlElem.length;
        this._htmlPositions.push(htmlLength);
        this._textPositions.push(textLength);
        textLength += textPost.length;
        htmlLength += htmlPost.length;
        htmlProcessed = '';
        if (/^&[^&;]*;$/gim.test(htmlElem)) {
          htmlProcessed = decodeHtml(htmlElem);
        }
        this._text += textPre + htmlProcessed + textPost;
      }
      if ('' === this._text && '' !== this._html) {
        this._text = new String(this._html);
      }
      if (0 === this._textPositions.length || 0 !== this._textPositions[0]) {
        this._htmlPositions.unshift(0);
        return this._textPositions.unshift(0);
      }
    };

    Traslator.prototype.text2html = function(pos) {
      var htmlPos, i, j, ref, textPos;
      htmlPos = 0;
      textPos = 0;
      for (i = j = 0, ref = this._textPositions.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        if (pos < this._textPositions[i]) {
          break;
        }
        htmlPos = this._htmlPositions[i];
        textPos = this._textPositions[i];
      }
      return htmlPos + pos - textPos;
    };

    Traslator.prototype.html2text = function(pos) {
      var htmlPos, i, j, ref, textPos;
      if (pos < this._htmlPositions[0]) {
        return 0;
      }
      htmlPos = 0;
      textPos = 0;
      for (i = j = 0, ref = this._htmlPositions.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        if (pos < this._htmlPositions[i]) {
          break;
        }
        htmlPos = this._htmlPositions[i];
        textPos = this._textPositions[i];
      }
      return textPos + pos - htmlPos;
    };

    Traslator.prototype.insertHtml = function(fragment, pos) {
      var htmlPos;
      htmlPos = this.text2html(pos.text);
      this._html = this._html.substring(0, htmlPos) + fragment + this._html.substring(htmlPos);
      return this.parse();
    };

    Traslator.prototype.getHtml = function() {
      return this._html;
    };

    Traslator.prototype.getText = function() {
      return this._text;
    };

    return Traslator;

  })();

  window.Traslator = Traslator;

  angular.module('wordlift.utils.directives', []).directive('wlOnError', [
    '$parse', '$window', '$log', function($parse, $window, $log) {
      return {
        restrict: 'A',
        compile: function($element, $attrs) {
          return function(scope, element) {
            var fn;
            fn = $parse($attrs.wlOnError);
            return element.on('error', function(event) {
              var callback;
              callback = function() {
                return fn(scope, {
                  $event: event
                });
              };
              return scope.$apply(callback);
            });
          };
        }
      };
    }
  ]).directive('wlFallback', [
    '$window', '$log', function($window, $log) {
      return {
        restrict: 'A',
        priority: 99,
        link: function($scope, $element, $attrs, $ctrl) {
          return $element.bind('error', function() {
            if ($attrs.src !== $attrs.wlFallback) {
              $log.warn("Error on " + $attrs.src + "! Going to fallback on " + $attrs.wlFallback);
              return $attrs.$set('src', $attrs.wlFallback);
            }
          });
        }
      };
    }
  ]).directive('wlClipboard', [
    '$document', '$log', function($document, $log) {
      return {
        restrict: 'E',
        scope: {
          text: '=',
          onCopied: '&'
        },
        transclude: true,
        template: "<span class=\"wl-widget-post-link\" ng-click=\"copyToClipboard()\">\n  <ng-transclude></ng-transclude>\n  <input type=\"text\" ng-value=\"text\" />\n</span>",
        link: function($scope, $element, $attrs, $ctrl) {
          $scope.node = $element.find('input');
          $scope.node.css('position', 'absolute');
          $scope.node.css('left', '-10000px');
          return $scope.copyToClipboard = function() {
            var selection;
            try {
              $document[0].body.style.webkitUserSelect = 'initial';
              selection = $document[0].getSelection();
              selection.removeAllRanges();
              $scope.node.select();
              if (!$document[0].execCommand('copy')) {
                $log.warn("Error on clipboard copy for " + text);
              }
              selection.removeAllRanges();
              if (angular.isFunction($scope.onCopied)) {
                return $scope.$evalAsync($scope.onCopied());
              }
            } finally {
              $document[0].body.style.webkitUserSelect = '';
            }
          };
        }
      };
    }
  ]);

  angular.module('wordlift.ui.carousel', ['ngTouch']).directive('wlCarousel', [
    '$window', '$log', function($window, $log) {
      return {
        restrict: 'A',
        scope: true,
        transclude: true,
        template: "<div class=\"wl-carousel\" ng-class=\"{ 'active' : areControlsVisible }\" ng-show=\"panes.length > 0\" ng-mouseover=\"showControls()\" ng-mouseleave=\"hideControls()\">\n  <div class=\"wl-panes\" ng-style=\"{ width: panesWidth, left: position }\" ng-transclude ng-swipe-left=\"next()\" ng-swipe-right=\"prev()\" ></div>\n  <div class=\"wl-carousel-arrows\" ng-show=\"areControlsVisible\" ng-class=\"{ 'active' : ( panes.length > 1 ) }\">\n    <i class=\"wl-angle left\" ng-click=\"prev()\" ng-show=\"isPrevArrowVisible()\" />\n    <i class=\"wl-angle right\" ng-click=\"next()\" ng-show=\"isNextArrowVisible()\" />\n  </div>\n</div>",
        controller: [
          '$scope', '$element', '$attrs', '$log', function($scope, $element, $attrs, $log) {
            var ctrl, w;
            w = angular.element($window);
            $scope.setItemWidth = function() {
              return $element.width() / $scope.visibleElements();
            };
            $scope.showControls = function() {
              return $scope.areControlsVisible = true;
            };
            $scope.hideControls = function() {
              return $scope.areControlsVisible = false;
            };
            $scope.visibleElements = function() {
              if ($element.width() > 460) {
                return 4;
              }
              return 1;
            };
            $scope.isPrevArrowVisible = function() {
              return $scope.currentPaneIndex > 0;
            };
            $scope.isNextArrowVisible = function() {
              return ($scope.panes.length - $scope.currentPaneIndex) > $scope.visibleElements();
            };
            $scope.next = function() {
              if (($scope.currentPaneIndex + $scope.visibleElements() + 1) > $scope.panes.length) {
                return;
              }
              $scope.position = $scope.position - $scope.itemWidth;
              return $scope.currentPaneIndex = $scope.currentPaneIndex + 1;
            };
            $scope.prev = function() {
              if ($scope.currentPaneIndex === 0) {
                return;
              }
              $scope.position = $scope.position + $scope.itemWidth;
              return $scope.currentPaneIndex = $scope.currentPaneIndex - 1;
            };
            $scope.setPanesWrapperWidth = function() {
              $scope.panesWidth = $scope.panes.length * $scope.itemWidth;
              $scope.position = 0;
              return $scope.currentPaneIndex = 0;
            };
            $scope.itemWidth = $scope.setItemWidth();
            $scope.panesWidth = void 0;
            $scope.panes = [];
            $scope.position = 0;
            $scope.currentPaneIndex = 0;
            $scope.areControlsVisible = false;
            w.bind('resize', function() {
              var j, len, pane, ref;
              $scope.itemWidth = $scope.setItemWidth();
              $scope.setPanesWrapperWidth();
              ref = $scope.panes;
              for (j = 0, len = ref.length; j < len; j++) {
                pane = ref[j];
                pane.scope.setWidth($scope.itemWidth);
              }
              return $scope.$apply();
            });
            ctrl = this;
            ctrl.registerPane = function(scope, element, first) {
              var pane;
              scope.setWidth($scope.itemWidth);
              pane = {
                'scope': scope,
                'element': element
              };
              $scope.panes.push(pane);
              return $scope.setPanesWrapperWidth();
            };
            return ctrl.unregisterPane = function(scope) {
              var index, j, len, pane, ref, unregisterPaneIndex;
              unregisterPaneIndex = void 0;
              ref = $scope.panes;
              for (index = j = 0, len = ref.length; j < len; index = ++j) {
                pane = ref[index];
                if (pane.scope.$id === scope.$id) {
                  unregisterPaneIndex = index;
                }
              }
              $scope.panes.splice(unregisterPaneIndex, 1);
              return $scope.setPanesWrapperWidth();
            };
          }
        ]
      };
    }
  ]).directive('wlCarouselPane', [
    '$log', function($log) {
      return {
        require: '^wlCarousel',
        restrict: 'EA',
        scope: {
          wlFirstPane: '='
        },
        transclude: true,
        template: "<div ng-transclude></div>",
        link: function($scope, $element, $attrs, $ctrl) {
          $element.addClass("wl-carousel-item");
          $scope.isFirst = $scope.wlFirstPane || false;
          $scope.setWidth = function(size) {
            return $element.css('width', size + "px");
          };
          $scope.$on('$destroy', function() {
            $log.debug("Destroy " + $scope.$id);
            return $ctrl.unregisterPane($scope);
          });
          return $ctrl.registerPane($scope, $element, $scope.isFirst);
        }
      };
    }
  ]);

  angular.module('wordlift.editpost.widget.controllers.EditPostWidgetController', ['wordlift.editpost.widget.services.AnalysisService', 'wordlift.editpost.widget.services.EditorService', 'wordlift.editpost.widget.services.GeoLocationService', 'wordlift.editpost.widget.providers.ConfigurationProvider']).filter('filterEntitiesByTypesAndRelevance', [
    'configuration', '$log', function(configuration, $log) {
      return function(items, types) {
        var annotations_count, entity, filtered, id, ref, treshold;
        filtered = [];
        if (items == null) {
          return filtered;
        }
        treshold = Math.floor(((1 / 120) * Object.keys(items).length) + 0.75);
        for (id in items) {
          entity = items[id];
          if (ref = entity.mainType, indexOf.call(types, ref) >= 0) {
            annotations_count = Object.keys(entity.annotations).length;
            if (annotations_count === 0) {
              continue;
            }
            if (annotations_count > treshold && entity.confidence === 1) {
              filtered.push(entity);
              continue;
            }
            if (entity.occurrences.length > 0) {
              filtered.push(entity);
              continue;
            }
            if (entity.id.startsWith(configuration.datasetUri)) {
              filtered.push(entity);
            }
          }
        }
        return filtered;
      };
    }
  ]).filter('filterEntitiesByTypes', [
    '$log', function($log) {
      return function(items, types) {
        var entity, filtered, id, ref;
        filtered = [];
        for (id in items) {
          entity = items[id];
          if (ref = entity.mainType, indexOf.call(types, ref) >= 0) {
            filtered.push(entity);
          }
        }
        return filtered;
      };
    }
  ]).filter('isEntitySelected', [
    '$log', function($log) {
      return function(items) {
        var entity, filtered, id;
        filtered = [];
        for (id in items) {
          entity = items[id];
          if (entity.occurrences.length > 0) {
            filtered.push(entity);
          }
        }
        return filtered;
      };
    }
  ]).controller('EditPostWidgetController', [
    'GeoLocationService', 'RelatedPostDataRetrieverService', 'EditorService', 'AnalysisService', 'configuration', '$log', '$scope', '$rootScope', '$parse', function(GeoLocationService, RelatedPostDataRetrieverService, EditorService, AnalysisService, configuration, $log, $scope, $rootScope, $parse) {
      var box, j, len, ref;
      $scope.isRunning = false;
      $scope.isGeolocationRunning = false;
      $scope.analysis = void 0;
      $scope.relatedPosts = void 0;
      $scope.newEntity = AnalysisService.createEntity();
      $scope.currentEntity = void 0;
      $scope.currentEntityType = void 0;
      $scope.setCurrentEntity = function(entity, entityType) {
        $log.debug("Going to set current entity " + entity.id + " as " + entityType);
        $scope.currentEntity = entity;
        $scope.currentEntityType = entityType;
        switch (entityType) {
          case 'entity':
            return $log.debug("A standard entity");
          case 'topic':
            return $log.debug("An entity used as topic");
          case 'publishingPlace':
            return $log.debug("An entity used as publishing place");
          default:
            $log.debug("A new entity");
            if (!$scope.isThereASelection && ($scope.annotation == null)) {
              $scope.addError("Select a text or an existing annotation in order to create a new entity. Text selections are valid only if they do not overlap other existing annotation");
              $scope.unsetCurrentEntity();
              return;
            }
            if ($scope.annotation != null) {
              $log.debug("There is a current annotation already. Nothing to do");
              $scope.unsetCurrentEntity();
              return;
            }
            return $scope.createTextAnnotationFromCurrentSelection();
        }
      };
      $scope.unsetCurrentEntity = function() {
        $scope.currentEntity = void 0;
        return $scope.currentEntityType = void 0;
      };
      $scope.storeCurrentEntity = function() {
        switch ($scope.currentEntityType) {
          case 'entity':
            $scope.analysis.entities[$scope.currentEntity.id] = $scope.currentEntity;
            break;
          case 'topic':
            $scope.topics[$scope.currentEntity.id] = $scope.currentEntity;
            break;
          case 'publishingPlace':
            $scope.suggestedPlaces[$scope.currentEntity.id] = $scope.currentEntity;
            break;
          default:
            $log.debug("Unset a new entity");
            $scope.addNewEntityToAnalysis();
        }
        return $scope.unsetCurrentEntity();
      };
      $scope.selectedEntities = {};
      $scope.copiedOnClipboard = function() {
        return $log.debug("Something copied on clipboard");
      };
      $scope.currentImage = void 0;
      $scope.setCurrentImage = function(image) {
        return $scope.currentImage = image;
      };
      $scope.isCurrentImage = function(image) {
        return $scope.currentImage === image;
      };
      $scope.currentSection = void 0;
      $scope.toggleCurrentSection = function(section) {
        if ($scope.currentSection === section) {
          return $scope.currentSection = void 0;
        } else {
          return $scope.currentSection = section;
        }
      };
      $scope.isCurrentSection = function(section) {
        return $scope.currentSection === section;
      };
      $scope.suggestedPlaces = void 0;
      $scope.publishedPlace = configuration.publishedPlace;
      $scope.topic = void 0;
      if (configuration.publishedPlace != null) {
        $scope.suggestedPlaces = {};
        $scope.suggestedPlaces[configuration.publishedPlace.id] = configuration.publishedPlace;
      }
      $scope.annotation = void 0;
      $scope.boxes = [];
      $scope.images = [];
      $scope.isThereASelection = false;
      $scope.configuration = configuration;
      $scope.errors = [];
      RelatedPostDataRetrieverService.load(Object.keys($scope.configuration.entities));
      $rootScope.$on("analysisFailed", function(event, errorMsg) {
        return $scope.addError(errorMsg);
      });
      $rootScope.$on("analysisServiceStatusUpdated", function(event, newStatus) {
        $scope.isRunning = newStatus;
        return EditorService.updateContentEditableStatus(!newStatus);
      });
      $rootScope.$watch('selectionStatus', function() {
        return $scope.isThereASelection = $rootScope.selectionStatus;
      });
      ref = $scope.configuration.classificationBoxes;
      for (j = 0, len = ref.length; j < len; j++) {
        box = ref[j];
        $scope.selectedEntities[box.id] = {};
      }
      $scope.addError = function(errorMsg) {
        return $scope.errors.unshift({
          type: 'error',
          msg: errorMsg
        });
      };
      $scope.createTextAnnotationFromCurrentSelection = function() {
        return EditorService.createTextAnnotationFromCurrentSelection();
      };
      $scope.selectAnnotation = function(annotationId) {
        return EditorService.selectAnnotation(annotationId);
      };
      $scope.hasAnalysis = function() {
        return $scope.analysis != null;
      };
      $scope.isEntitySelected = function(entity, box) {
        return $scope.selectedEntities[box.id][entity.id] != null;
      };
      $scope.isLinkedToCurrentAnnotation = function(entity) {
        var ref1;
        return (ref1 = $scope.annotation, indexOf.call(entity.occurrences, ref1) >= 0);
      };
      $scope.addNewEntityToAnalysis = function() {
        var $scopeId, annotation;
        if ($scope.newEntity.sameAs) {
          $scope.newEntity.sameAs = [$scope.newEntity.sameAs];
        }
        delete $scope.newEntity.suggestedSameAs;
        $scope.analysis.entities[$scope.newEntity.id] = $scope.newEntity;
        annotation = $scope.analysis.annotations[$scope.annotation];
        annotation.entityMatches.push({
          entityId: $scope.newEntity.id,
          confidence: 1
        });
        $scope.analysis.entities[$scope.newEntity.id].annotations[annotation.id] = annotation;
        $scope.analysis.annotations[$scope.annotation].entities[$scope.newEntity.id] = $scope.newEntity;
        $scopeId = configuration.getCategoryForType($scope.newEntity.mainType);
        $log.debug("Going to select ");
        return $scope.onSelectedEntityTile($scope.analysis.entities[$scope.newEntity.id], scope);
      };
      $scope.$on("updateOccurencesForEntity", function(event, entityId, occurrences) {
        var entities, ref1, results1;
        $log.debug("Occurrences " + occurrences.length + " for " + entityId);
        $scope.analysis.entities[entityId].occurrences = occurrences;
        if (occurrences.length === 0) {
          ref1 = $scope.selectedEntities;
          results1 = [];
          for (box in ref1) {
            entities = ref1[box];
            results1.push(delete $scope.selectedEntities[box][entityId]);
          }
          return results1;
        }
      });
      $scope.$watch("annotation", function(newAnnotationId) {
        var annotation;
        $log.debug("Current annotation id changed to " + newAnnotationId);
        if ($scope.isRunning) {
          return;
        }
        if (newAnnotationId == null) {
          return;
        }
        $scope.newEntity = AnalysisService.createEntity();
        annotation = $scope.analysis.annotations[newAnnotationId];
        $scope.newEntity.label = annotation.text;
        $scope.currentEntity = $scope.newEntity;
        return AnalysisService.getSuggestedSameAs(annotation.text);
      });
      $scope.$on("currentUserLocalityDetected", function(event, locality) {
        $log.debug("Looking for entities matching with " + locality);
        return AnalysisService._innerPerform(locality).then(function(response) {
          var entity, id, ref1;
          $scope.suggestedPlaces = {};
          ref1 = response.data.entities;
          for (id in ref1) {
            entity = ref1[id];
            if ('place' === entity.mainType) {
              entity.id = id;
              $scope.suggestedPlaces[id] = entity;
            }
          }
          return $scope.isGeolocationRunning = false;
        });
      });
      $scope.$on("geoLocationError", function(event, error) {
        return $scope.isGeolocationRunning = false;
      });
      $scope.$on("textAnnotationClicked", function(event, annotationId) {
        var id, ref1, results1;
        $scope.annotation = annotationId;
        ref1 = $scope.boxes;
        results1 = [];
        for (id in ref1) {
          box = ref1[id];
          results1.push(box.addEntityFormIsVisible = false);
        }
        return results1;
      });
      $scope.$on("textAnnotationAdded", function(event, annotation) {
        $log.debug("added a new annotation with Id " + annotation.id);
        $scope.analysis.annotations[annotation.id] = annotation;
        return $scope.annotation = annotation.id;
      });
      $scope.$on("sameAsRetrieved", function(event, sameAs) {
        return $scope.newEntity.suggestedSameAs = sameAs;
      });
      $scope.$on("relatedPostsLoaded", function(event, posts) {
        return $scope.relatedPosts = posts;
      });
      $scope.$on("analysisPerformed", function(event, analysis) {
        var entity, entityId, id, k, l, len1, len2, ref1, ref2, ref3, topic;
        $scope.analysis = analysis;
        if ($scope.configuration.topic != null) {
          ref1 = analysis.topics;
          for (id in ref1) {
            topic = ref1[id];
            if (indexOf.call($scope.configuration.topic.sameAs, id) >= 0) {
              $scope.topic = topic;
            }
          }
        }
        ref2 = $scope.configuration.classificationBoxes;
        for (k = 0, len1 = ref2.length; k < len1; k++) {
          box = ref2[k];
          ref3 = box.selectedEntities;
          for (l = 0, len2 = ref3.length; l < len2; l++) {
            entityId = ref3[l];
            if (entity = analysis.entities[entityId]) {
              if (entity.occurrences.length === 0) {
                $log.warn("Entity " + entityId + " selected as " + box.label + " without valid occurences!");
                continue;
              }
              $scope.selectedEntities[box.id][entityId] = analysis.entities[entityId];
              $scope.images = $scope.images.concat(entity.images);
            } else {
              $log.warn("Entity with id " + entityId + " should be linked to " + box.id + " but is missing");
            }
          }
        }
        return $scope.currentSection = 'content-classification';
      });
      $scope.updateRelatedPosts = function() {
        var entities, entity, entityIds, id, ref1;
        $log.debug("Going to update related posts box ...");
        entityIds = [];
        ref1 = $scope.selectedEntities;
        for (box in ref1) {
          entities = ref1[box];
          for (id in entities) {
            entity = entities[id];
            entityIds.push(id);
          }
        }
        return RelatedPostDataRetrieverService.load(entityIds);
      };
      $scope.onSelectedEntityTile = function(entity, scopeId) {
        $log.debug("Entity tile selected for entity " + entity.id + " within " + scopeId + " scope");
        if ($scope.selectedEntities[scopeId][entity.id] == null) {
          $scope.selectedEntities[scopeId][entity.id] = entity;
          $scope.images = $scope.images.concat(entity.images);
          $scope.$emit("entitySelected", entity, $scope.annotation);
          $scope.selectAnnotation(void 0);
        } else {
          $scope.images = $scope.images.filter(function(img) {
            return indexOf.call(entity.images, img) < 0;
          });
          $scope.$emit("entityDeselected", entity, $scope.annotation);
        }
        return $scope.updateRelatedPosts();
      };
      $scope.getLocation = function() {
        $scope.isGeolocationRunning = true;
        return GeoLocationService.getLocation();
      };
      $scope.isPublishedPlace = function(entity) {
        var ref1;
        return entity.id === ((ref1 = $scope.publishedPlace) != null ? ref1.id : void 0);
      };
      $scope.hasPublishedPlace = function() {
        return ($scope.publishedPlace != null) || ($scope.suggestedPlaces != null);
      };
      $scope.onPublishedPlaceSelected = function(entity) {
        var ref1;
        if (((ref1 = $scope.publishedPlace) != null ? ref1.id : void 0) === entity.id) {
          $scope.publishedPlace = void 0;
          return;
        }
        return $scope.publishedPlace = entity;
      };
      $scope.isTopic = function(topic) {
        var ref1;
        return topic.id === ((ref1 = $scope.topic) != null ? ref1.id : void 0);
      };
      return $scope.onTopicSelected = function(topic) {
        var ref1;
        if (((ref1 = $scope.topic) != null ? ref1.id : void 0) === topic.id) {
          $scope.topic = void 0;
          return;
        }
        return $scope.topic = topic;
      };
    }
  ]);

  angular.module('wordlift.editpost.widget.directives.wlClassificationBox', []).directive('wlClassificationBox', [
    'configuration', '$log', function(configuration, $log) {
      return {
        restrict: 'E',
        scope: true,
        transclude: true,
        templateUrl: function() {
          return configuration.defaultWordLiftPath + 'templates/wordlift-directive-classification-box.html';
        },
        link: function($scope, $element, $attrs, $ctrl) {
          return $scope.hasSelectedEntities = function() {
            return Object.keys($scope.selectedEntities[$scope.box.id]).length > 0;
          };
        },
        controller: function($scope, $element, $attrs) {
          var ctrl;
          $scope.tiles = [];
          $scope.boxes[$scope.box.id] = $scope;
          ctrl = this;
          ctrl.addTile = function(tile) {
            return $scope.tiles.push(tile);
          };
          return ctrl.closeTiles = function() {
            var j, len, ref, results1, tile;
            ref = $scope.tiles;
            results1 = [];
            for (j = 0, len = ref.length; j < len; j++) {
              tile = ref[j];
              results1.push(tile.isOpened = false);
            }
            return results1;
          };
        }
      };
    }
  ]);

  angular.module('wordlift.editpost.widget.directives.wlEntityForm', []).directive('wlEntityForm', [
    'configuration', '$window', '$log', function(configuration, $window, $log) {
      return {
        restrict: 'E',
        scope: {
          entity: '=',
          onSubmit: '&',
          box: '='
        },
        templateUrl: function() {
          return configuration.defaultWordLiftPath + 'templates/wordlift-widget-be/wordlift-entity-panel.html';
        },
        link: function($scope, $element, $attrs, $ctrl) {
          $scope.configuration = configuration;
          $scope.currentCategory = void 0;
          $scope.$watch('entity.id', function(entityId) {
            var category, ref;
            if (entityId != null) {
              $log.debug("Entity updated to " + entityId);
              category = configuration.getCategoryForType((ref = $scope.entity) != null ? ref.mainType : void 0);
              $log.debug("Going to update current category to " + category);
              return $scope.currentCategory = category;
            }
          });
          $scope.setCurrentCategory = function(categoryId) {
            return $scope.currentCategory = categoryId;
          };
          $scope.unsetCurrentCategory = function() {
            var ref;
            $scope.currentCategory = void 0;
            return (ref = $scope.entity) != null ? ref.mainType = void 0 : void 0;
          };
          $scope.setType = function(entityType) {
            var ref, ref1;
            if (entityType === ((ref = $scope.entity) != null ? ref.mainType : void 0)) {
              return;
            }
            return (ref1 = $scope.entity) != null ? ref1.mainType = entityType : void 0;
          };
          $scope.isCurrentType = function(entityType) {
            var ref;
            return ((ref = $scope.entity) != null ? ref.mainType : void 0) === entityType;
          };
          $scope.getAvailableTypes = function() {
            return configuration.getTypesForCategoryId($scope.currentCategory);
          };
          $scope.removeCurrentImage = function(index) {
            var removed;
            removed = $scope.entity.images.splice(index, 1);
            return $log.warn("Removed " + removed + " from entity " + $scope.entity.id + " images collection");
          };
          $scope.linkTo = function(linkType) {
            return $window.location.href = ajaxurl + '?action=wordlift_redirect&uri=' + $window.encodeURIComponent($scope.entity.id) + "&to=" + linkType;
          };
          $scope.hasOccurences = function() {
            var ref;
            return ((ref = $scope.entity.occurrences) != null ? ref.length : void 0) > 0;
          };
          $scope.setSameAs = function(uri) {
            return $scope.entity.sameAs = uri;
          };
          return $scope.isNew = function(uri) {
            return !/^(f|ht)tps?:\/\//i.test($scope.entity.id);
          };
        }
      };
    }
  ]);

  angular.module('wordlift.editpost.widget.directives.wlEntityTile', []).directive('wlEntityTile', [
    'configuration', '$log', function(configuration, $log) {
      return {
        require: '?^wlClassificationBox',
        restrict: 'E',
        scope: {
          entity: '=',
          isSelected: '=',
          showConfidence: '=',
          onSelect: '&',
          onMore: '&'
        },
        templateUrl: function() {
          return configuration.defaultWordLiftPath + 'templates/wordlift-directive-entity-tile.html';
        },
        link: function($scope, $element, $attrs, $boxCtrl) {
          if ($boxCtrl != null) {
            $boxCtrl.addTile($scope);
          }
          $scope.isOpened = false;
          $scope.isInternal = function() {
            if ($scope.entity.id.startsWith(configuration.datasetUri)) {
              return true;
            }
            return false;
          };
          return $scope.toggle = function() {
            if (!$scope.isOpened) {
              if ($boxCtrl != null) {
                $boxCtrl.closeTiles();
              }
            }
            return $scope.isOpened = !$scope.isOpened;
          };
        }
      };
    }
  ]);

  angular.module('wordlift.editpost.widget.directives.wlEntityInputBox', []).directive('wlEntityInputBox', [
    'configuration', '$log', function(configuration, $log) {
      return {
        restrict: 'E',
        scope: {
          entity: '='
        },
        templateUrl: function() {
          return configuration.defaultWordLiftPath + 'templates/wordlift-directive-entity-input-box.html';
        }
      };
    }
  ]);

  angular.module('wordlift.editpost.widget.services.AnalysisService', []).service('AnalysisService', [
    'configuration', '$log', '$http', '$rootScope', function(configuration, $log, $http, $rootScope) {
      var box, extend, findAnnotation, j, k, len, len1, merge, ref, ref1, service, type, uniqueId;
      uniqueId = function(length) {
        var id;
        if (length == null) {
          length = 8;
        }
        id = '';
        while (id.length < length) {
          id += Math.random().toString(36).substr(2);
        }
        return id.substr(0, length);
      };
      merge = function(options, overrides) {
        return extend(extend({}, options), overrides);
      };
      extend = function(object, properties) {
        var key, val;
        for (key in properties) {
          val = properties[key];
          object[key] = val;
        }
        return object;
      };
      findAnnotation = function(annotations, start, end) {
        var annotation, id;
        for (id in annotations) {
          annotation = annotations[id];
          if (annotation.start === start && annotation.end === end) {
            return annotation;
          }
        }
      };
      service = {
        _isRunning: false,
        _currentAnalysis: void 0,
        _supportedTypes: [],
        _defaultType: "thing"
      };
      service.cleanAnnotations = function(analysis, positions) {
        var annotation, annotationId, annotationRange, isOverlapping, j, k, len, pos, ref, ref1, ref2, results1;
        if (positions == null) {
          positions = [];
        }
        ref = analysis.annotations;
        for (annotationId in ref) {
          annotation = ref[annotationId];
          if (annotation.start > 0 && annotation.end > annotation.start) {
            annotationRange = (function() {
              results1 = [];
              for (var j = ref1 = annotation.start, ref2 = annotation.end; ref1 <= ref2 ? j <= ref2 : j >= ref2; ref1 <= ref2 ? j++ : j--){ results1.push(j); }
              return results1;
            }).apply(this);
            isOverlapping = false;
            for (k = 0, len = annotationRange.length; k < len; k++) {
              pos = annotationRange[k];
              if (indexOf.call(positions, pos) >= 0) {
                isOverlapping = true;
              }
              break;
            }
            if (isOverlapping) {
              $log.warn("Annotation with id: " + annotationId + " start: " + annotation.start + " end: " + annotation.end + " overlaps an existing annotation");
              $log.debug(annotation);
              this.deleteAnnotation(analysis, annotationId);
            } else {
              positions = positions.concat(annotationRange);
            }
          }
        }
        return analysis;
      };
      ref = configuration.classificationBoxes;
      for (j = 0, len = ref.length; j < len; j++) {
        box = ref[j];
        ref1 = box.registeredTypes;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          type = ref1[k];
          if (indexOf.call(service._supportedTypes, type) < 0) {
            service._supportedTypes.push(type);
          }
        }
      }
      service.createEntity = function(params) {
        var defaults;
        if (params == null) {
          params = {};
        }
        defaults = {
          id: 'local-entity-' + uniqueId(32),
          label: '',
          description: '',
          mainType: 'thing',
          types: [],
          images: [],
          confidence: 1,
          occurrences: [],
          annotations: {}
        };
        return merge(defaults, params);
      };
      service.deleteAnnotation = function(analysis, annotationId) {
        var ea, index, l, len2, ref2;
        $log.warn("Going to remove overlapping annotation with id " + annotationId);
        if (analysis.annotations[annotationId] != null) {
          ref2 = analysis.annotations[annotationId].entityMatches;
          for (index = l = 0, len2 = ref2.length; l < len2; index = ++l) {
            ea = ref2[index];
            delete analysis.entities[ea.entityId].annotations[annotationId];
          }
          delete analysis.annotations[annotationId];
        }
        return analysis;
      };
      service.createAnnotation = function(params) {
        var defaults;
        if (params == null) {
          params = {};
        }
        defaults = {
          id: 'urn:local-text-annotation-' + uniqueId(32),
          text: '',
          start: 0,
          end: 0,
          entities: [],
          entityMatches: []
        };
        return merge(defaults, params);
      };
      service.parse = function(data) {
        var annotation, annotationId, ea, em, entity, id, index, l, len2, len3, len4, localEntity, local_confidence, m, n, originalTopics, ref10, ref11, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, topic;
        originalTopics = data.topics;
        data.topics = {};
        for (l = 0, len2 = originalTopics.length; l < len2; l++) {
          topic = originalTopics[l];
          topic.id = topic.uri;
          topic.occurrences = [];
          topic.mainType = this._defaultType;
          data.topics[topic.id] = topic;
        }
        ref2 = configuration.entities;
        for (id in ref2) {
          localEntity = ref2[id];
          data.entities[id] = localEntity;
        }
        ref3 = data.entities;
        for (id in ref3) {
          entity = ref3[id];
          if (!entity.label) {
            $log.warn("Label missing for entity " + id);
          }
          if (!entity.description) {
            $log.warn("Description missing for entity " + id);
          }
          if (!entity.sameAs) {
            $log.warn("sameAs missing for entity " + id);
            entity.sameAs = [];
            if ((ref4 = configuration.entities[id]) != null) {
              ref4.sameAs = [];
            }
            $log.debug("Schema.org sameAs overridden for entity " + id);
          }
          if (ref5 = entity.mainType, indexOf.call(this._supportedTypes, ref5) < 0) {
            $log.warn("Schema.org type " + entity.mainType + " for entity " + id + " is not supported from current classification boxes configuration");
            entity.mainType = this._defaultType;
            if ((ref6 = configuration.entities[id]) != null) {
              ref6.mainType = this._defaultType;
            }
            $log.debug("Schema.org type overridden for entity " + id);
          }
          entity.id = id;
          entity.occurrences = [];
          entity.annotations = {};
          entity.confidence = 1;
        }
        ref7 = data.annotations;
        for (id in ref7) {
          annotation = ref7[id];
          annotation.id = id;
          annotation.entities = {};
          data.annotations[id].entityMatches = (function() {
            var len3, m, ref8, results1;
            ref8 = annotation.entityMatches;
            results1 = [];
            for (m = 0, len3 = ref8.length; m < len3; m++) {
              ea = ref8[m];
              if (ea.entityId !== configuration.currentPostUri) {
                results1.push(ea);
              }
            }
            return results1;
          })();
          ref8 = data.annotations[id].entityMatches;
          for (index = m = 0, len3 = ref8.length; m < len3; index = ++m) {
            ea = ref8[index];
            if (!data.entities[ea.entityId].label) {
              data.entities[ea.entityId].label = annotation.text;
              $log.debug("Missing label retrived from related annotation for entity " + ea.entityId);
            }
            data.entities[ea.entityId].annotations[id] = annotation;
            data.annotations[id].entities[ea.entityId] = data.entities[ea.entityId];
          }
        }
        ref9 = data.entities;
        for (id in ref9) {
          entity = ref9[id];
          ref10 = data.annotations;
          for (annotationId in ref10) {
            annotation = ref10[annotationId];
            local_confidence = 1;
            ref11 = annotation.entityMatches;
            for (n = 0, len4 = ref11.length; n < len4; n++) {
              em = ref11[n];
              if ((em.entityId != null) && em.entityId === id) {
                local_confidence = em.confidence;
              }
            }
            entity.confidence = entity.confidence * local_confidence;
          }
        }
        return data;
      };
      service.getSuggestedSameAs = function(content) {
        var promise;
        return promise = this._innerPerform(content).then(function(response) {
          var entity, id, matches, ref2, suggestions;
          suggestions = [];
          ref2 = response.data.entities;
          for (id in ref2) {
            entity = ref2[id];
            if (matches = id.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)) {
              suggestions.push({
                id: id,
                label: entity.label,
                mainType: entity.mainType,
                soource: matches[1]
              });
            }
          }
          $log.debug(suggestions);
          return $rootScope.$broadcast("sameAsRetrieved", suggestions);
        });
      };
      service._innerPerform = function(content) {
        $log.info("Start to performing analysis");
        return $http({
          method: 'post',
          url: ajaxurl + '?action=wordlift_analyze',
          data: content
        });
      };
      service._updateStatus = function(status) {
        service._isRunning = status;
        return $rootScope.$broadcast("analysisServiceStatusUpdated", status);
      };
      service.perform = function(content) {
        var promise;
        if (service._currentAnalysis) {
          $log.warn("Analysis already runned! Nothing to do ...");
          service._updateStatus(false);
          return;
        }
        service._updateStatus(true);
        promise = this._innerPerform(content);
        promise.then(function(response) {
          service._currentAnalysis = response.data;
          return $rootScope.$broadcast("analysisPerformed", service.parse(response.data));
        });
        promise["catch"](function(response) {
          $log.error(response.data);
          return $rootScope.$broadcast("analysisFailed", response.data);
        });
        return promise["finally"](function(response) {
          return service._updateStatus(false);
        });
      };
      service.preselect = function(analysis, annotations) {
        var annotation, e, entity, id, l, len2, ref2, ref3, results1, textAnnotation;
        $log.debug("Going to perform annotations preselection");
        results1 = [];
        for (l = 0, len2 = annotations.length; l < len2; l++) {
          annotation = annotations[l];
          if (annotation.start === annotation.end) {
            $log.warn("There is a broken empty annotation for entityId " + annotation.uri);
            continue;
          }
          textAnnotation = findAnnotation(analysis.annotations, annotation.start, annotation.end);
          if (textAnnotation == null) {
            $log.warn("Annotation " + annotation.start + ":" + annotation.end + " for entityId " + annotation.uri + " misses in the analysis");
            textAnnotation = this.createAnnotation({
              start: annotation.start,
              end: annotation.end,
              text: annotation.label
            });
            analysis.annotations[textAnnotation.id] = textAnnotation;
          }
          entity = analysis.entities[annotation.uri];
          ref2 = configuration.entities;
          for (id in ref2) {
            e = ref2[id];
            if (ref3 = annotation.uri, indexOf.call(e.sameAs, ref3) >= 0) {
              entity = analysis.entities[e.id];
            }
          }
          if (entity == null) {
            $log.warn("Entity with uri " + annotation.uri + " is missing both in analysis results and in local storage");
            continue;
          }
          analysis.entities[entity.id].occurrences.push(textAnnotation.id);
          if (analysis.entities[entity.id].annotations[textAnnotation.id] == null) {
            analysis.entities[entity.id].annotations[textAnnotation.id] = textAnnotation;
            analysis.annotations[textAnnotation.id].entityMatches.push({
              entityId: entity.id,
              confidence: 1
            });
            results1.push(analysis.annotations[textAnnotation.id].entities[entity.id] = analysis.entities[entity.id]);
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      };
      return service;
    }
  ]);

  angular.module('wordlift.editpost.widget.services.EditorService', ['wordlift.editpost.widget.services.AnalysisService']).service('EditorService', [
    'configuration', 'AnalysisService', '$log', '$http', '$rootScope', function(configuration, AnalysisService, $log, $http, $rootScope) {
      var INVISIBLE_CHAR, currentOccurencesForEntity, dedisambiguate, disambiguate, editor, findEntities, findPositions, service;
      INVISIBLE_CHAR = '\uFEFF';
      findEntities = function(html) {
        var annotation, match, pattern, results1, traslator;
        traslator = Traslator.create(html);
        pattern = /<(\w+)[^>]*\sitemid="([^"]+)"[^>]*>([^<]*)<\/\1>/gim;
        results1 = [];
        while (match = pattern.exec(html)) {
          annotation = {
            start: traslator.html2text(match.index),
            end: traslator.html2text(match.index + match[0].length),
            uri: match[2],
            label: match[3]
          };
          results1.push(annotation);
        }
        return results1;
      };
      findPositions = function(entities) {
        var entityAnnotation, j, k, len, positions, ref, ref1, results1;
        positions = [];
        for (j = 0, len = entities.length; j < len; j++) {
          entityAnnotation = entities[j];
          positions = positions.concat((function() {
            results1 = [];
            for (var k = ref = entityAnnotation.start, ref1 = entityAnnotation.end; ref <= ref1 ? k <= ref1 : k >= ref1; ref <= ref1 ? k++ : k--){ results1.push(k); }
            return results1;
          }).apply(this));
        }
        return positions;
      };
      editor = function() {
        return tinyMCE.get('content');
      };
      disambiguate = function(annotation, entity) {
        var discardedItemId, ed, j, len, ref, type;
        ed = editor();
        ed.dom.addClass(annotation.id, "disambiguated");
        ref = configuration.types;
        for (j = 0, len = ref.length; j < len; j++) {
          type = ref[j];
          ed.dom.removeClass(annotation.id, type.css);
        }
        ed.dom.removeClass(annotation.id, "unlinked");
        ed.dom.addClass(annotation.id, "wl-" + entity.mainType);
        discardedItemId = ed.dom.getAttrib(annotation.id, "itemid");
        ed.dom.setAttrib(annotation.id, "itemid", entity.id);
        return discardedItemId;
      };
      dedisambiguate = function(annotation, entity) {
        var discardedItemId, ed;
        ed = editor();
        ed.dom.removeClass(annotation.id, "disambiguated");
        ed.dom.removeClass(annotation.id, "wl-" + entity.mainType);
        discardedItemId = ed.dom.getAttrib(annotation.id, "itemid");
        ed.dom.setAttrib(annotation.id, "itemid", "");
        return discardedItemId;
      };
      currentOccurencesForEntity = function(entityId) {
        var annotation, annotations, ed, itemId, j, len, occurrences;
        ed = editor();
        occurrences = [];
        if (entityId === "") {
          return occurrences;
        }
        annotations = ed.dom.select("span.textannotation");
        for (j = 0, len = annotations.length; j < len; j++) {
          annotation = annotations[j];
          itemId = ed.dom.getAttrib(annotation.id, "itemid");
          if (itemId === entityId) {
            occurrences.push(annotation.id);
          }
        }
        return occurrences;
      };
      $rootScope.$on("analysisPerformed", function(event, analysis) {
        if ((analysis != null) && (analysis.annotations != null)) {
          return service.embedAnalysis(analysis);
        }
      });
      $rootScope.$on("entitySelected", function(event, entity, annotationId) {
        var annotation, discarded, entityId, id, j, len, occurrences, ref;
        discarded = [];
        if (annotationId != null) {
          discarded.push(disambiguate(entity.annotations[annotationId], entity));
        } else {
          ref = entity.annotations;
          for (id in ref) {
            annotation = ref[id];
            discarded.push(disambiguate(annotation, entity));
          }
        }
        for (j = 0, len = discarded.length; j < len; j++) {
          entityId = discarded[j];
          if (entityId) {
            occurrences = currentOccurencesForEntity(entityId);
            $rootScope.$broadcast("updateOccurencesForEntity", entityId, occurrences);
          }
        }
        occurrences = currentOccurencesForEntity(entity.id);
        return $rootScope.$broadcast("updateOccurencesForEntity", entity.id, occurrences);
      });
      $rootScope.$on("entityDeselected", function(event, entity, annotationId) {
        var annotation, discarded, entityId, id, j, len, occurrences, ref;
        discarded = [];
        if (annotationId != null) {
          dedisambiguate(entity.annotations[annotationId], entity);
        } else {
          ref = entity.annotations;
          for (id in ref) {
            annotation = ref[id];
            dedisambiguate(annotation, entity);
          }
        }
        for (j = 0, len = discarded.length; j < len; j++) {
          entityId = discarded[j];
          if (entityId) {
            occurrences = currentOccurencesForEntity(entityId);
            $rootScope.$broadcast("updateOccurencesForEntity", entityId, occurrences);
          }
        }
        occurrences = currentOccurencesForEntity(entity.id);
        return $rootScope.$broadcast("updateOccurencesForEntity", entity.id, occurrences);
      });
      service = {
        hasSelection: function() {
          var ed, pattern;
          ed = editor();
          if (ed != null) {
            if (ed.selection.isCollapsed()) {
              return false;
            }
            pattern = /<([\/]*[a-z]+)[^<]*>/;
            if (pattern.test(ed.selection.getContent())) {
              $log.warn("The selection overlaps html code");
              return false;
            }
            return true;
          }
          return false;
        },
        isEditor: function(editor) {
          var ed;
          ed = editor();
          return ed.id === editor.id;
        },
        updateContentEditableStatus: function(status) {
          var ed;
          ed = editor();
          return ed.getBody().setAttribute('contenteditable', status);
        },
        createTextAnnotationFromCurrentSelection: function() {
          var content, ed, htmlPosition, text, textAnnotation, textAnnotationSpan, textPosition, traslator;
          ed = editor();
          if (ed.selection.isCollapsed()) {
            $log.warn("Invalid selection! The text annotation cannot be created");
            return;
          }
          text = "" + (ed.selection.getSel());
          textAnnotation = AnalysisService.createAnnotation({
            text: text
          });
          textAnnotationSpan = "<span id=\"" + textAnnotation.id + "\" class=\"textannotation unlinked selected\">" + (ed.selection.getContent()) + "</span>" + INVISIBLE_CHAR;
          ed.selection.setContent(textAnnotationSpan);
          content = ed.getContent({
            format: 'raw'
          });
          traslator = Traslator.create(content);
          htmlPosition = content.indexOf(textAnnotationSpan);
          textPosition = traslator.html2text(htmlPosition);
          textAnnotation.start = textPosition;
          textAnnotation.end = textAnnotation.start + text.length;
          return $rootScope.$broadcast('textAnnotationAdded', textAnnotation);
        },
        selectAnnotation: function(annotationId) {
          var annotation, ed, j, len, ref;
          ed = editor();
          ref = ed.dom.select("span.textannotation");
          for (j = 0, len = ref.length; j < len; j++) {
            annotation = ref[j];
            ed.dom.removeClass(annotation.id, "selected");
          }
          $rootScope.$broadcast('textAnnotationClicked', void 0);
          if (ed.dom.hasClass(annotationId, "textannotation")) {
            ed.dom.addClass(annotationId, "selected");
            return $rootScope.$broadcast('textAnnotationClicked', annotationId);
          }
        },
        embedAnalysis: (function(_this) {
          return function(analysis) {
            var annotation, annotationId, ed, element, em, entities, entity, html, isDirty, j, len, ref, ref1, traslator;
            ed = editor();
            html = ed.getContent({
              format: 'raw'
            });
            entities = findEntities(html);
            AnalysisService.cleanAnnotations(analysis, findPositions(entities));
            AnalysisService.preselect(analysis, entities);
            while (html.match(/<(\w+)[^>]*\sclass="textannotation[^"]*"[^>]*>([^<]+)<\/\1>/gim, '$2')) {
              html = html.replace(/<(\w+)[^>]*\sclass="textannotation[^"]*"[^>]*>([^<]*)<\/\1>/gim, '$2');
            }
            traslator = Traslator.create(html);
            ref = analysis.annotations;
            for (annotationId in ref) {
              annotation = ref[annotationId];
              if (annotation.entityMatches.length === 0) {
                $log.warn("Annotation " + annotation.text + " [" + annotation.start + ":" + annotation.end + "] with id " + annotation.id + " has no entity matches!");
                continue;
              }
              element = "<span id=\"" + annotationId + "\" class=\"textannotation";
              ref1 = annotation.entityMatches;
              for (j = 0, len = ref1.length; j < len; j++) {
                em = ref1[j];
                entity = analysis.entities[em.entityId];
                if (indexOf.call(entity.occurrences, annotationId) >= 0) {
                  element += " disambiguated wl-" + entity.mainType + "\" itemid=\"" + entity.id;
                }
              }
              element += "\">";
              traslator.insertHtml(element, {
                text: annotation.start
              });
              traslator.insertHtml('</span>', {
                text: annotation.end
              });
            }
            html = traslator.getHtml();
            html = html.replace(/<\/span>/gim, "</span>" + INVISIBLE_CHAR);
            $rootScope.$broadcast("analysisEmbedded");
            isDirty = ed.isDirty();
            ed.setContent(html, {
              format: 'raw'
            });
            return ed.isNotDirty = !isDirty;
          };
        })(this)
      };
      return service;
    }
  ]);

  angular.module('wordlift.editpost.widget.services.RelatedPostDataRetrieverService', []).service('RelatedPostDataRetrieverService', [
    'configuration', '$log', '$http', '$rootScope', function(configuration, $log, $http, $rootScope) {
      var service;
      service = {};
      service.load = function(entityIds) {
        var uri;
        if (entityIds == null) {
          entityIds = [];
        }
        uri = "admin-ajax.php?action=wordlift_related_posts&post_id=" + configuration.currentPostId;
        $log.debug("Going to find related posts");
        $log.debug(entityIds);
        return $http({
          method: 'post',
          url: uri,
          data: entityIds
        }).success(function(data) {
          $log.debug(data);
          return $rootScope.$broadcast("relatedPostsLoaded", data);
        }).error(function(data, status) {
          return $log.warn("Error loading related posts");
        });
      };
      return service;
    }
  ]);

  angular.module('wordlift.editpost.widget.services.GeoLocationService', ['geolocation']).service('GeoLocationService', [
    'geolocation', '$log', '$rootScope', '$document', '$q', '$timeout', function(geolocation, $log, $rootScope, $document, $q, $timeout) {
      var GOOGLE_MAPS_API_ENDPOINT, GOOGLE_MAPS_LEVEL, loadGoogleAPI, service;
      GOOGLE_MAPS_API_ENDPOINT = 'https://maps.googleapis.com/maps/api/js';
      GOOGLE_MAPS_LEVEL = 'locality';
      $rootScope.$on('error', function(event, msg) {
        $log.warn("Geolocation error: " + msg);
        return $rootScope.$broadcast('geoLocationError', msg);
      });
      this.googleApiLoaded = false;
      this.googleApiPromise = void 0;
      loadGoogleAPI = function() {
        var callback, deferred, element;
        if (this.googleApiPromise != null) {
          return this.googleApiPromise;
        }
        deferred = $q.defer();
        element = $document[0].createElement('script');
        element.src = GOOGLE_MAPS_API_ENDPOINT;
        $document[0].body.appendChild(element);
        callback = function(e) {
          var ref;
          if (element.readyState && ((ref = element.readyState) !== 'complete' && ref !== 'loaded')) {
            return;
          }
          return $timeout(function() {
            return deferred.resolve(e);
          });
        };
        element.onload = callback;
        element.onreadystatechange = callback;
        element.onerror = function(e) {
          return $timeout(function() {
            return deferred.reject(e);
          });
        };
        this.googleApiPromise = deferred.promise;
        return this.googleApiPromise;
      };
      service = {};
      service.getLocation = function() {
        return geolocation.getLocation().then(function(data) {
          $log.debug("Detected position: latitude " + data.coords.latitude + ", longitude " + data.coords.longitude);
          return loadGoogleAPI().then(function() {
            var geocoder;
            geocoder = new google.maps.Geocoder();
            return geocoder.geocode({
              'location': {
                'lat': data.coords.latitude,
                'lng': data.coords.longitude
              }
            }, function(results, status) {
              var j, len, result;
              if (status === google.maps.GeocoderStatus.OK) {
                for (j = 0, len = results.length; j < len; j++) {
                  result = results[j];
                  if (indexOf.call(result.types, GOOGLE_MAPS_LEVEL) >= 0) {
                    $rootScope.$broadcast("currentUserLocalityDetected", result.formatted_address);
                    return;
                  }
                }
              }
            });
          });
        });
      };
      return service;
    }
  ]);

  angular.module('wordlift.editpost.widget.providers.ConfigurationProvider', []).provider("configuration", function() {
    var _configuration, provider;
    _configuration = void 0;
    provider = {
      setConfiguration: function(configuration) {
        _configuration = configuration;
        _configuration.getCategoryForType = function(entityType) {
          var category, j, len, ref;
          if (!entityType) {
            return void 0;
          }
          ref = this.classificationBoxes;
          for (j = 0, len = ref.length; j < len; j++) {
            category = ref[j];
            if (indexOf.call(category.registeredTypes, entityType) >= 0) {
              return category.id;
            }
          }
        };
        _configuration.getTypesForCategoryId = function(categoryId) {
          var category, j, len, ref;
          if (!categoryId) {
            return [];
          }
          ref = this.classificationBoxes;
          for (j = 0, len = ref.length; j < len; j++) {
            category = ref[j];
            if (categoryId === category.id) {
              return category.registeredTypes;
            }
          }
        };
        _configuration.isInternal = function(uri) {
          return uri.startsWith(this.datasetUri);
        };
        return _configuration.getUriForType = function(mainType) {
          var j, len, ref, type;
          ref = this.types;
          for (j = 0, len = ref.length; j < len; j++) {
            type = ref[j];
            if (type.css === ("wl-" + mainType)) {
              return type.uri;
            }
          }
        };
      },
      $get: function() {
        return _configuration;
      }
    };
    return provider;
  });

  $ = jQuery;

  angular.module('wordlift.editpost.widget', ['wordlift.ui.carousel', 'wordlift.utils.directives', 'wordlift.editpost.widget.providers.ConfigurationProvider', 'wordlift.editpost.widget.controllers.EditPostWidgetController', 'wordlift.editpost.widget.directives.wlClassificationBox', 'wordlift.editpost.widget.directives.wlEntityForm', 'wordlift.editpost.widget.directives.wlEntityTile', 'wordlift.editpost.widget.directives.wlEntityInputBox', 'wordlift.editpost.widget.services.AnalysisService', 'wordlift.editpost.widget.services.EditorService', 'wordlift.editpost.widget.services.RelatedPostDataRetrieverService']).config(function(configurationProvider) {
    return configurationProvider.setConfiguration(window.wordlift);
  });

  $(container = $("<div\n      id=\"wordlift-edit-post-wrapper\"\n      ng-controller=\"EditPostWidgetController\"\n      ng-include=\"configuration.defaultWordLiftPath + 'templates/wordlift-editpost-widget.html'\">\n    </div>").appendTo('#wordlift-edit-post-outer-wrapper'), injector = angular.bootstrap($('#wordlift-edit-post-wrapper'), ['wordlift.editpost.widget']), tinymce.PluginManager.add('wordlift', function(editor, url) {
    var fireEvent;
    if (editor.id !== "content") {
      return;
    }
    fireEvent = function(editor, eventName, callback) {
      switch (tinymce.majorVersion) {
        case '4':
          return editor.on(eventName, callback);
        case '3':
          return editor["on" + eventName].add(callback);
      }
    };
    injector.invoke([
      'EditorService', '$rootScope', '$log', function(EditorService, $rootScope, $log) {
        var j, len, method, originalMethod, ref, results1;
        ref = ['setMarkers', 'toViews'];
        results1 = [];
        for (j = 0, len = ref.length; j < len; j++) {
          method = ref[j];
          if (wp.mce.views[method] != null) {
            originalMethod = wp.mce.views[method];
            $log.warn("Override wp.mce.views method " + method + "() to prevent shortcodes rendering");
            wp.mce.views[method] = function(content) {
              return content;
            };
            $rootScope.$on("analysisEmbedded", function(event) {
              $log.info("Going to restore wp.mce.views method " + method + "()");
              return wp.mce.views[method] = originalMethod;
            });
            $rootScope.$on("analysisFailed", function(event) {
              $log.info("Going to restore wp.mce.views method " + method + "()");
              return wp.mce.views[method] = originalMethod;
            });
            break;
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }
    ]);
    fireEvent(editor, "LoadContent", function(e) {
      return injector.invoke([
        'AnalysisService', 'EditorService', '$rootScope', '$log', function(AnalysisService, EditorService, $rootScope, $log) {
          return $rootScope.$apply(function() {
            var html, text;
            html = editor.getContent({
              format: 'raw'
            });
            text = Traslator.create(html).getText();
            if (text.match(/[a-zA-Z0-9]+/)) {
              EditorService.updateContentEditableStatus(false);
              return AnalysisService.perform(text);
            } else {
              return $log.warn("Blank content: nothing to do!");
            }
          });
        }
      ]);
    });
    fireEvent(editor, "NodeChange", function(e) {
      return injector.invoke([
        'AnalysisService', 'EditorService', '$rootScope', '$log', function(AnalysisService, EditorService, $rootScope, $log) {
          if (AnalysisService._currentAnalysis) {
            $rootScope.$apply(function() {
              return $rootScope.selectionStatus = EditorService.hasSelection();
            });
          }
          return true;
        }
      ]);
    });
    return fireEvent(editor, "Click", function(e) {
      return injector.invoke([
        'AnalysisService', 'EditorService', '$rootScope', '$log', function(AnalysisService, EditorService, $rootScope, $log) {
          if (AnalysisService._currentAnalysis) {
            $rootScope.$apply(function() {
              return EditorService.selectAnnotation(e.target.id);
            });
          }
          return true;
        }
      ]);
    });
  }));

}).call(this);

//# sourceMappingURL=wordlift-reloaded.js.map
