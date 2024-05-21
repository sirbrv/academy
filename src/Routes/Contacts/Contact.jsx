import { useState, useEffect, useRef } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "../../hooks/useForm";

import Swal from "sweetalert2";
import { useAppContext } from "../../hooks/appContext";
import ValidateErrors from "../../componets/services/ValidateErrors";
import validationSchema from "../../componets/services/validationSchema";

export default function Contact({ contact, edit, riviewList }) {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const { HandleNivelClose } = useAppContext();
  const url = `${hostServer}/api/contact`;
  const [error, setError] = useState(false);
  const [courses, setCourses] = useState([]);
  const initialForm = {
    id: contact ? contact.id : "",
    nombre: contact ? contact.nombre : "",
    email: contact ? contact.email : "",
    celular: contact ? contact.celular : "",
    city: contact ? contact.city : "",
    curso: contact ? contact.curso : "",
    message: contact ? contact.message : "",
    condicion: contact ? contact.condicion : "",
  };

  const { formData, onInputChange, validateForm, errorsInput, clearForm } =
    useForm(initialForm, validationSchema);

  const { id, nombre, email, celular, message, city, curso, condicion } =
    formData;

  let {
    data,
    isLoading = false,
    getData,
    createData,
    updateData,
  } = useFetch(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numError = validateForm();
    if (!numError) {
      let url = `${api}`;
      if (!edit) {
        await createData(url, formData);
      } else {
        await updateData(url, contact.id, formData);
      }
    } else {
      Swal.fire({
        position: "top",
        icon: "info",
        title: "Debes corregir la información para poder registrarla",
        showConfirmButton: false,
        timer: 5000,
      });
    }
  };

  useEffect(() => {
    if (data?.message) {
      data?.message &&
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: data?.message,
          showConfirmButton: false,
          timer: 3500,
        });
    } else {
      if (data?.status === 200 || data?.status === 201) {
        data?.data.message &&
          Swal.fire({
            position: "top",
            icon: "success",
            title: data?.data?.message,
            showConfirmButton: false,
            timer: 3500,
          });
      } else {
        data?.data.message &&
          Swal.fire({
            position: "top",
            icon: "warning",
            title: data?.data?.message,
            showConfirmButton: false,
            timer: 3500,
          });
      }
      if (data?.status === 200) {
        HandleNivelClose();
        // riviewList();
      }
      if (data?.status === 201) {
        clearForm();
        // riviewList();
      }
    }
  }, [data]);

  const getCourses = async () => {
    const url = `${hostServer}/api/courses`;

    // let url = "http://localhost:5000/api/";
    let response = await fetch(url);
    let responseCurso = await response.json();
    if (responseCurso) {
      if (async () => await responseCurso?.data) {
        setCourses(responseCurso?.data);
      }
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <>
      {error ? (
        errorMessage()
      ) : (
        <>
          <div className="container px-5  ">
            <h3>Contacto</h3>
            <form onSubmit={handleSubmit} className="contact">
              <div className="row mt-4">
                <div className="form-group col-md-6">
                  <label htmlFor="nombre">Nombre Completo </label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    placeholder="Ingrese Nombres Completo"
                    value={nombre}
                    onChange={onInputChange}
                  />
                  {errorsInput.nombre && (
                    <ValidateErrors errors={errorsInput.nombre} />
                  )}{" "}
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="email">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Ingrese el Coreo Electónico"
                    value={email}
                    onChange={onInputChange}
                  />
                  {errorsInput.email && (
                    <ValidateErrors errors={errorsInput.email} />
                  )}
                </div>
              </div>
              <div className="row  mt-3">
                <div className="form-group col-md-6">
                  <label htmlFor="celular">Número de Celular </label>
                  <input
                    type="text"
                    className="form-control"
                    name="celular"
                    placeholder="Ingrese Número Telefónico Celular"
                    value={celular}
                    onChange={onInputChange}
                  />
                  {errorsInput.celular && (
                    <ValidateErrors errors={errorsInput.celular} />
                  )}{" "}
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={city}
                    onChange={onInputChange}
                  />
                </div>
              </div>

              <div className="row  mt-3">
                <div className="form-group col-md-12">
                  <label htmlFor="curso"> Nuestro Curso Disponibles </label>
                  <select
                    name="curso"
                    className="form-control"
                    value={curso}
                    onChange={onInputChange}
                  >
                    <option>Seleccione un curso</option>
                    {courses.map((item) => (
                      <option
                        key={item.id}
                        value={item.nombre}
                      >{`${item.nombre}`}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mt-3">
                <label htmlFor="message">Dejanos tu Comentários</label>
                <textarea
                  // type="textarea"
                  className="form-control"
                  rows={5}
                  name="message"
                  placeholder="Escriba su mensaje"
                  value={message}
                  onChange={onInputChange}
                />
              </div>

              <div className="btn-submit  mt-3">
                {edit ? (
                  <button type="submit" className="btn btn-primary w-100">
                    Actualizar
                  </button>
                ) : (
                  <button type="submit" className="btn btn-success w-100">
                    Agregar
                  </button>
                )}
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
