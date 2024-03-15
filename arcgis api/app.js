document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded");
  require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
  ], function (Map, MapView, FeatureLayer) {
    const myMap = new Map({
      basemap: "streets-navigation-vector",
    });

    const view = new MapView({
      container: "viewDiv",
      map: myMap,
      center: [-100, 40],
      zoom: 4,
    });

    const featureLayer = new FeatureLayer({
      url: "https://services.gis.ca.gov/arcgis/rest/services/Boundaries/CA_Counties/FeatureServer/0",
      popupTemplate: {
        title: "CA countries",
        content: "OBJECTID: {OBJECTID}<br>Population : {Population}<br>AREA_ID: {AREA_ID}",
      },
    });

    view.whenLayerView(featureLayer).then((layerView) => {
      const filterInput1 = document.getElementById("filterInput1");
      const filterInput2 = document.getElementById("filterInput2");
      const fieldSelect1 = document.getElementById("fieldSelect1");
      const fieldSelect2 = document.getElementById("fieldSelect2");

      [fieldSelect1, fieldSelect2].forEach((fieldSelect) => {
        layerView.layer.fields.forEach((field) => {
          let option = document.createElement("option");
          option.value = option.id = field.name;
          option.text = field.alias;
          option.fieldType = field.type;
          fieldSelect.append(option);
        });
      });

      function applyFilter() {
        const inputValue1 = filterInput1.value.trim();
        const inputValue2 = filterInput2.value.trim();
        const field1 = fieldSelect1.value;
        const field2 = fieldSelect2.value;

        if (inputValue1 !== "" && inputValue2 !== "") {
          const expression = `${field1} = '${inputValue1}' AND ${field2} = '${inputValue2}'`;
          featureLayer.definitionExpression = expression;
        } else {
          featureLayer.definitionExpression = "1=1"; // Reset filter if no input
        }
      }

      filterInput1.addEventListener("input", applyFilter);
      filterInput2.addEventListener("input", applyFilter);
      fieldSelect1.addEventListener("change", () => { filterInput1.value = ""; applyFilter(); });
      fieldSelect2.addEventListener("change", () => { filterInput2.value = ""; applyFilter(); });
    });

    myMap.add(featureLayer);
  });
});

