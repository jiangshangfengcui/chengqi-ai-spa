report({
  "testSuite": "BackstopJS",
  "tests": [
    {
      "pair": {
        "reference": "../../../backstop_data/bitmaps_reference/backstop_default_qq_map_mobile_0_document_0_phone.png",
        "test": "../../../backstop_data/bitmaps_test/20250902-210743/backstop_default_qq_map_mobile_0_document_0_phone.png",
        "selector": "document",
        "fileName": "backstop_default_qq_map_mobile_0_document_0_phone.png",
        "label": "qq map mobile",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "https://map.qq.com/m/",
        "referenceUrl": "",
        "expect": 0,
        "viewportLabel": "phone",
        "diff": {
          "isSameDimensions": false,
          "dimensionDifference": {
            "width": -594,
            "height": -92
          },
          "rawMisMatchPercentage": 37.98074722290039,
          "misMatchPercentage": "37.98",
          "analysisTime": 36
        },
        "diffImage": "../../../backstop_data/bitmaps_test/20250902-210743/failed_diff_backstop_default_qq_map_mobile_0_document_0_phone.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "../../../backstop_data/bitmaps_reference/backstop_default_qq_map_mobile_0_document_1_tablet.png",
        "test": "../../../backstop_data/bitmaps_test/20250902-210743/backstop_default_qq_map_mobile_0_document_1_tablet.png",
        "selector": "document",
        "fileName": "backstop_default_qq_map_mobile_0_document_1_tablet.png",
        "label": "qq map mobile",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "https://map.qq.com/m/",
        "referenceUrl": "",
        "expect": 0,
        "viewportLabel": "tablet",
        "error": "Reference file not found /Users/wola/Documents/workspace/scq-ai-spa/backstop_data/bitmaps_reference/backstop_default_qq_map_mobile_0_document_1_tablet.png"
      },
      "status": "fail"
    }
  ],
  "id": "backstop_default"
});