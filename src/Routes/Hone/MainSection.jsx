import React from "react";
import img from "../../assets/vertical-market-software.webp";
import { useUsersContext } from "../../hooks/UsersContext";

function MainSection() {
  const { usersContext } = useUsersContext();
  return (
    <>
      {
        <div className="mt-4">
          {usersContext.login && (
            <p>
              Bienvenido Sr(a) {usersContext.nombre} {usersContext.apellido}
            </p>
          )}
          <h2>Bienvenido a IT ACADEMY</h2>
          <hr />
          <section className="prinSetion">
            <aside>
              <p>
                Nos complace ofrecer una amplia gama de{" "}
                <b>cursos de informática</b>
                diseñados para satisfacer sus necesidades de aprendizaje, sin
                importar su nivel de experiencia. En nuestro instituto,
                encontrará un equipo dedicado de instructores expertos
                apasionados por la enseñanza y listos para ayudarlo a tener
                éxito.
              </p>
              <p>
                Nuestra misión es brindarle las habilidades y conocimientos que
                necesita para tener éxito en la era digital actual. Creemos que
                todos deberían tener acceso a una educación de calidad, por eso
                nos esforzamos por brindar opciones de aprendizaje asequibles y
                flexibles. Nuestros cursos están diseñados para ser prácticos y
                prácticos, brindándole la oportunidad de aplicar lo que aprende
                en entornos del mundo real.
              </p>
              <p>
                <b>Únase al mejor instituto de IT</b> y emprenda un viaje de
                crecimiento y éxito con nosotros.
              </p>
              <h1>Formando Grandes Profesionales</h1>
            </aside>
            <aside>
              <img src={img} alt="" />
            </aside>
          </section>
        </div>
      }
    </>
  );
}

export default MainSection;
