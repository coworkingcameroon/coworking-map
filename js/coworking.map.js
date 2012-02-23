(function($) { "use strict";
window.Coworking = {};
window.$Map = (window.Coworking.Map = function() {}).prototype = new Object();

$Map.metadata_url = location.search
    .replace(/.*?(data=https?:\/\/.*?(?:[;&]|$))?.*/, '$1');
console.log(location.search, $Map.metadata_url);
if (!$Map.metadata_url)
    $Map.metadata_url = 'https://raw.github.com/coworking/coworking-metadata/master/metadata.jsonp';

$Map.run = function() {
    $.ajax({
        'url': this.metadata_url,
        'dataType': 'jsonp',
        'crossDomain': true,
        'jsonp': false
    });
};

$Map.add_metadata = function(data) {
    this.metadata = data;
    this.generate();
};

$Map.generate = function() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: new google.maps.LatLng(39.397, -100.644),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var infowindow = new google.maps.InfoWindow();

    var metadata = this.metadata;
    var self = this;
    for (var i = 0, l = metadata.length; i < l; i++) {  
        var data = metadata[i];
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.geo.lat, data.geo.long),
            map: map,
            title: data.Name
        });

        google.maps.event.addListener(marker, 'click', (function(marker, data) {
            return function() {
                infowindow.setContent(self.createContent(data));
                infowindow.open(map, marker);
            }
        })(marker, data));
    }
};

$Map.createContent = function(data) {
    var name = data.Name;
    var url = data.URL;
    var addr = data.address;
    var content = '';
    if (url) {
        var target = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_');
        content +=
            '<a href="' + url +
            '" target="_' + target +
            '">' + name + '</a>';
    }
    else {
        content += name;
    }
    content += '<br/>';
    if (addr) {
        content += '<pre>';
        for (var i = 0, l = addr.length; i < l; i++) {
            if (addr[i] != '.')
                content += addr[i] + '\n';
        }
        content += '</pre>';
    }
    return content;
};

// Close  wrapper function and call it.
})(jQuery);
