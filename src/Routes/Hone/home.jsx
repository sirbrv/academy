import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DropdownMenu from "../../componets/menu/menu";
import Menu from "../../componets/menu/menu";
import routes from "../index";
import { Link } from "react-router-dom";
import MainSection from "./MainSection";
import CardCourse from "./CardCourse";
import Contact from "../Contacts/Contact";

const Home = () => {
  return (
    <>
      <div className="container">
        <MainSection />
        <CardCourse />
        <h2 className="mt-5">Enlístate Con Nosotros</h2>
        <hr />
        <p>
          Envíanos un mensaje y te atenderemos a la brevedad posible. Registrate
          en el siguientes <Link to={"/register"}>link</Link> y forma parte de
          nuestra institución y nuestro selecto grupos de estudiantes.
        </p>
        <Contact />
      </div>
    </>
  );
};

export default Home;
