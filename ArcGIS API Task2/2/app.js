document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded");
  require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/symbols/SimpleFillSymbol",
    "esri/Graphic",
  ], function (Map, MapView, FeatureLayer, SimpleFillSymbol, Graphic) {
    const myMap = new Map({
      basemap: "streets-navigation-vector",
    });

    const view = new MapView({
      container: "viewDiv",
      map: myMap,
      center: [-100, 40],
      zoom: 4,
    });

    setTimeout(() => {
      //   view.zoom = 10;
      //   view.center = [-140, 40];
    }, 3000);

    const featureLayer = new FeatureLayer({
      url: "https://services.gis.ca.gov/arcgis/rest/services/Boundaries/CA_Counties/FeatureServer/0",
      popupTemplate: {
        title: "CA countries",
        content:
          "OBJECTID: {OBJECTID}<br>Population : {Population}<br>AREA_ID: {AREA_ID}<br>DETAIL_CITY: {DETAIL_CITY}",
      },
    });

    const featureLayer2 = new FeatureLayer({
      url: "https://services.gis.ca.gov/arcgis/rest/services/Boundaries/CA_National_Parks/MapServer/0",
    });

    view.whenLayerView(featureLayer).then((layerView) => {
      const filterInput = document.getElementById("filterInput");
      const fieldSelect = document.getElementById("fieldSelect");

      layerView.layer.fields.forEach((field) => {
        let option = document.createElement("option");
        option.value = option.id = field.name;
        option.text = field.alias;
        option.fieldType = field.type;
        fieldSelect.append(option);
      });

      filterInput.addEventListener("input", (e) => {
        console.log("Input event triggered");
        const inputValue = e.target.value.trim();
        const field = fieldSelect.value;
        console.log("Input Value:", inputValue);
        console.log("Selected Field:", field);
        if (field === "POLYGON_NM" && inputValue.startsWith("S")) {
          const tableRows = document.querySelectorAll("#features-table tbody tr");
          tableRows.forEach((row) => {
            const fieldValue = row.querySelector(`td[data-field="${field}"]`).textContent.trim().toLowerCase();
            if (fieldValue === inputValue.toLowerCase()) { // Convert both values to lowercase for case-insensitive comparison
              row.classList.add("highlight");
            } else {
              row.classList.remove("highlight");
            }
          });
        } else {
          const tableRows = document.querySelectorAll("#features-table tbody tr");
          tableRows.forEach((row) => {
            row.classList.remove("highlight");
          });
        }
        const optionType = document.getElementById(field).fieldType;
        if (inputValue !== "") {
          if (optionType === "integer" || optionType === "double") {
            featureLayer.definitionExpression = field + " = " + inputValue;
          } else if (optionType === "string") {
            featureLayer.definitionExpression =
              "upper(" + field + ") LIKE '%" + inputValue.toUpperCase() + "%'";
          } else {
            console.warn("Unsupported field type:", fieldInfo.type);
          }
        } else {
          featureLayer.definitionExpression = "1=1";
        }
      });
    });

    var fieldSelect = document.getElementById("fieldSelect");
    fieldSelect.addEventListener("change", function (e) {
      document.getElementById("filterInput").value = "";
    });

    myMap.add(featureLayer);
    myMap.add(featureLayer2);

    const fields = ["AREA_ID", "POLYGON_NM", "Population"];
    let query = featureLayer.createQuery();
    query.where = "POLYGON_NM like 'S%'";
    query.outFields = fields;
    query.returnGeometry = true;

    featureLayer.queryFeatures(query).then(function (response) {
      const features = response.features;
      const attributes = features.map((feature) => feature.attributes);
      const geometries = features.map((feature) => feature.geometry);

      const featuresTable = document.getElementById("features-table");
      const featuresTableHeader = featuresTable.querySelector("thead");
      const featuresTableBody = featuresTable.querySelector("tbody");

      const headerTr = document.createElement("tr");
      featuresTableHeader.append(headerTr);

      fields.forEach((field) => {
        const th = document.createElement("th");
        th.textContent = field;
        headerTr.append(th);
      });

      attributes.forEach((attribute, index) => {
        const tr = document.createElement("tr");
        tr.id = index;
 
        fields.forEach((field) => {
          const td = document.createElement("td");
          td.textContent = attribute[field];
          td.setAttribute("data-field", field);
          tr.append(td);
        });
        featuresTableBody.append(tr);

        tr.addEventListener("click", (e) => {
          view.graphics.removeAll();
          const index = e.currentTarget.id;
          const geometry = geometries[index];

          const symbol = new SimpleFillSymbol({
            color: [51, 51, 204, 0.9],
            style: "solid",
            outline: {
              color: "white",
              width: 1,
            },
          });

          const graphic = new Graphic({
            geometry: geometry,
            symbol: symbol,
          });

          view.graphics.add(graphic);
          view.goTo(geometry);
        });
      });
    });

    let query2 = featureLayer2.createQuery();

    query2.groupByFieldsForStatistics = ["UNIT_TYPE"];
    query2.outStatistics = [
      {
        statisticType: "count",
        onStatisticField: "UNIT_TYPE",
        outStatisticFieldName: "TOTALCOUNT",
      },
    ];

    query2.outFields = ["*"];
    query2.where = "UNIT_TYPE <> ''";

    featureLayer2
      .queryFeatures(query2)
      .then(function (response) {
        const features = response.features;
        const attributes = features.map((feature) => feature.attributes);

        const xAxisData = attributes.map((attribute) => attribute["UNIT_TYPE"]);
        const values = attributes.map((attribute) => attribute["TOTALCOUNT"]);

        const myChart = echarts.init(document.getElementById("someChart"));

        let option = {
          title: {
            text: "ECharts Getting Started Example",
          },
          tooltip: {},
          legend: {
            data: ["sales"],
          },
          xAxis: {
            data: xAxisData,
          },
          yAxis: {},
          series: [
            {
              name: "sales",
              type: "bar",
              data: values,
            },
          ],
        };

        myChart.setOption(option);
       // Assuming `myChart` is the ECharts instance

        // Listen for click events on the bars
        myChart.on('click', function (params) {
          // Retrieve the category (UNIT_TYPE) for the clicked bar
          const selectedCategory = params.name;

          // Create a definition expression to filter the FeatureLayer
          const definitionExpression = `UNIT_TYPE = '${selectedCategory}'`;

          // Apply the definition expression to highlight the locations on the map
          featureLayer2.definitionExpression = definitionExpression;

          // Clear previous graphics from the view
          view.graphics.removeAll();

          // Query the features based on the updated definition expression
          let query = featureLayer2.createQuery();
          query.where = definitionExpression;
          featureLayer2.queryFeatures(query).then(function (response) {
              const features = response.features;
              features.forEach(function (feature) {
                  const geometry = feature.geometry;

                  const symbol = new SimpleFillSymbol({
                      color: [51, 51, 204, 0.9],
                      style: "solid",
                      outline: {
                          color: "white",
                          width: 1,
                      },
                  });

                  const graphic = new Graphic({
                      geometry: geometry,
                      symbol: symbol,
                  });

                  // Add the graphic to the view
                  view.graphics.add(graphic);
              });

              // Zoom to the extent of the features
              view.goTo(features);
          }).catch(function (error) {
              console.error("Error querying features:", error);
          });
        });

      })
      .catch((err) => console.log(err));
  });
});
