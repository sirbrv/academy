import React from "react";
import { SlSocialInstagram } from "react-icons/sl";
import { ImWhatsapp } from "react-icons/im";
import { TfiEmail } from "react-icons/tfi";
import { BsTelephone } from "react-icons/bs";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { PiMapPinLine } from "react-icons/pi";

export default function Footer() {
  return (
    <>
      <footer>
        <section className="footer-body">
          <div className="ubicacion">
            <h3>Puntos de Contactos</h3>
            <h5 className="linea">___________</h5>
            <p className="encuentrano">
              {" "}
              <PiMapPinLine className="icon-color" /> Primer piso, Sindhu
              Center, Moon Market, cerca del restaurante Bundu Khan, Allama
              Iqbal Town, Lahore
            </p>
            <p className="phone">
              <BsTelephone className="icon-color" /> +598 543234543
            </p>
            <p className="correo">
              <MdOutlineMarkEmailRead className="icon-color" /> info@academy.com
            </p>
          </div>
          <div className="abour">
            <h3>About</h3>
            <h5 className="linea">___________</h5>
            <p>
              Estamos aquí para la comunidad. La misión es hacer que la
              educación de calidad sea asequible y accesible para todos en esta
              región. Es por eso que IT Academy ofrece una variedad de programas
              de TI a costos razonables para los estudiantes.
            </p>
          </div>
          <div className="ubicanos">
            <h3>Puedes Ubicarnos</h3>
            <h5 className="linea">___________</h5>
            <h6>
              <ImWhatsapp className="icon-color" /> WhatSapp
            </h6>
            <h6>
              <SlSocialInstagram className="icon-color" /> Instagram
            </h6>
            <h6>
              <TfiEmail className="icon-color" /> Correo Electrónico
            </h6>
          </div>
        </section>
        <section className="footer-footer">
          <p>Copyright 2024 - IT Academy - Todos los derechos reservados.</p>
        </section>
      </footer>
    </>
  );
}
