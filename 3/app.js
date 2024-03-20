document.addEventListener("DOMContentLoaded", () => {
  require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/geometry/Point",
    "esri/geometry/Circle",
    "esri/widgets/Home",
  ], function (
    Map,
    MapView,
    Graphic,
    GraphicsLayer,
    SimpleMarkerSymbol,
    SimpleFillSymbol,
    Point,
    Circle,
    Home,
  ) {
    let map = new Map({
      basemap: "streets-navigation-vector",
    });

    let view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-100, 40],
      zoom: 4,
    });

    let graphicsLayerPoints = new GraphicsLayer();
    let graphicsLayerCircles = new GraphicsLayer();
    map.addMany([graphicsLayerPoints, graphicsLayerCircles]);

    let iconSymbol = new SimpleMarkerSymbol({
      color: "black",
      size: "12px",
      outline: {
        color: [255, 255, 255],
        width: 1,
      },
    });
    let homeWidget = new Home({
      view: view,
    });
    view.ui.add(homeWidget, "top-left");
    let circleSymbol = new SimpleFillSymbol({
      color: "red",
      outline: {
        color: [255, 255, 255],
        width: 1,
      },
    });

    view.on("click", (e) => {
      let graphic;
      if (document.getElementById("drawPoint").classList.contains("active")) {
        graphic = new Graphic({
          geometry: e.mapPoint,
          symbol: iconSymbol,
        });
        graphicsLayerPoints.add(graphic);
      } else if (document.getElementById("drawCircle").classList.contains("active")) {
        let radius = document.getElementById("radiusSlider").value*1000;
        let circle = new Circle({
          center: e.mapPoint,
          radius: parseFloat(radius), 
        });
        graphic = new Graphic({
          geometry: circle,
          symbol: circleSymbol,
        });
        graphicsLayerCircles.add(graphic);
      }
    });

    document.getElementById("drawPoint").addEventListener("click", () => {
      toggleActiveButton("drawPoint");
    });

    document.getElementById("drawCircle").addEventListener("click", () => {
      toggleActiveButton("drawCircle");
    });

    document.getElementById("clearPoints").addEventListener("click", () => {
      graphicsLayerPoints.removeAll();
    });

    document.getElementById("clearCircles").addEventListener("click", () => {
      graphicsLayerCircles.removeAll();
    });

    document.getElementById("radiusSlider").addEventListener("input", (e) => {
      document.getElementById("radiusValue").textContent = e.target.value + "km";
      let activeCircle = graphicsLayerCircles.graphics.find((graphic) => graphic.symbol === circleSymbol);
      if (activeCircle) {
        let radius = parseFloat(e.target.value);
        activeCircle.geometry.radius = radius;
        graphicsLayerCircles.remove(activeCircle);
        graphicsLayerCircles.add(activeCircle);
      }
    });

    function toggleActiveButton(buttonId) {
      let buttons = document.querySelectorAll(".controls button");
      buttons.forEach((button) => {
        button.classList.remove("active");
      });
      document.getElementById(buttonId).classList.add("active");
    }
  });
});
