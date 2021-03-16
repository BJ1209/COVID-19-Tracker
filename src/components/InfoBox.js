import React from "react";
import { Card } from "@material-ui/core";
import "./InfoBox.css";
function InfoBox({active, title,activeStyle,stylesCard, stylesText, cases, total, ...props }) {
    return (
    <Card onClick={props.onClick} style={active ? activeStyle : stylesCard } className='infobox' variant="outlined">
      <h3 style={stylesText} className="infobox__title">
        {title}
      </h3>
      {cases ? (
        <h2 style={stylesText} className="infobox__cases">
          +{cases}
        </h2>
      ) : (
        <h2 style={stylesText} className="infobox__cases">
        </h2>
)}
      <h3 style={stylesText} className="infobox__totalcases">
        {total}
      </h3>
    </Card>
  );
}

export default InfoBox;
