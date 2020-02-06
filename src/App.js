import React from 'react';
import ButtonContainer from './zoomButton';
import './App.css';
import TreeContainer from './tree';
function App() {
  const _data = {
    "data": {
      "name": "Root",
      "values": [],
      "children": [{
        "name": "",
        "values": [
          [
            "Delta",
            "$ 0.00"
          ]
        ],
        "children": []
      },
      {
        "name": "Communication Services",
        "values": [
          [
            "Delta",
            "$ 4,330.60"
          ]
        ],
        "children": []
      },
      {
        "name": "Consumer Discretionary",
        "values": [
          [
            "Delta",
            "$ 4,951.00"
          ]
        ],
        "children": []
      },
      {
        "name": "Consumer Staples",
        "values": [
          [
            "Delta",
            "$ 1,219.99"
          ]
        ],
        "children": []
      },
      {
        "name": "Energy",
        "values": [
          [
            "Delta",
            "$ 406.66"
          ]
        ],
        "children": []
      },
      {
        "name": "Financials",
        "values": [
          [
            "Delta",
            "$ 1,947.17"
          ]
        ],
        "children": []
      },
      {
        "name": "Health Care",
        "values": [
          [
            "Delta",
            "$ 2,534.11"
          ]
        ],
        "children": []
      },
      {
        "name": "Industrials",
        "values": [
          [
            "Delta",
            "$ 2,377.24"
          ]
        ],
        "children": []
      },
      {
        "name": "Information Technology",
        "values": [
          [
            "Delta",
            "$ 2,636.58"
          ]
        ],
        "children": []
      },
      {
        "name": "Materials",
        "values": [
          [
            "Delta",
            "$ 107.88"
          ]
        ],
        "children": []
      },
      {
        "name": "Real Estate",
        "values": [
          [
            "Delta",
            "$ 144.82"
          ]
        ],
        "children": []
      },
      {
        "name": "Utilities",
        "values": [
          [
            "Delta",
            "$ 573.45"
          ]
        ],
        "children": []
      }
      ]
    },
    "columnNames": [
      "Delta"
    ]
  };
  return (
    <div className="App">
      <ButtonContainer />
      <TreeContainer data={_data}/>
    </div>
  );
}

export default App;
