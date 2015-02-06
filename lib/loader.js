var debug = require('debug')('geotargeting:loader');
var request = require( 'co-request' );
var fs = require('fs');

var KML_BASE_URL = process.env.KML_SERVICE || "http://mapsengine.google.com/map/u/1/kml?mid=";

module.exports = function ( options ) {
  "use strict";
  return function *loader ( next ) {
    var mapId = this.params.map;

    if ( !mapId ) {
      return;
    }

    if ( this.body && this.type === 'text/xml' ) {
      // We have the map from cache, just go to next middlewares.
      yield next;
      return;
    }

    var data;
    try {
      data = fs.readFileSync('./kmls/'+mapId+'.kml', 'utf-8');
    } catch (ex) {
      var response = yield request( KML_BASE_URL + mapId );
      debug( 'Requested KML data for map ' + mapId + ' with status ' + response.statusCode );
      data = response.body;
    } finally {
      this.body = data;
      this.type = 'text/xml';

      yield next;
    } 
    
  }
}