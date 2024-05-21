import { useState, useEffect, useRef } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "../../hooks/useForm";

import Swal from "sweetalert2";
import { useAppContext } from "../../hooks/appContext";
import ValidateErrors from "../../componets/services/ValidateErrors";
import validationSchema from "../../componets/services/validationSchema";

export default function Student({ title }) {
  const edit = false;
  const student = [];
  const { HandleNivelClose } = useAppContext();
  const api = "http://localhost:5000/api/student";
  const [error, setError] = useState(false);
  const initialForm = {
    id: student ? student.id : "",
    dni: student ? student.dni : "",
    nombre: student ? student.nombre : "",
    apellido: student ? student.apellido : "",
    email: student ? student.email : "",
    password: student ? student.pasword : "",
    confirmPassword: "",
    adress: student ? student.adress : "",
    fechaNacimiento: student ? student.fechaNacimiento : new Date("2023/12/31"),
    city: student ? student.city : "",
    celular: student ? student.celular : "",
    condicion: student ? student.condicion : "",
  };

  const { formData, onInputChange, validateForm, errorsInput, clearForm } =
    useForm(initialForm, validationSchema);

  const {
    id,
    dni,
    nombre,
    apellido,
    email,
    password,
    confirmPassword,
    celular,
    fechaNacimiento,
    adress,
    city,
    condicion,
  } = formData;

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
        await updateData(url, student.id, formData);
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
      }
      if (data?.status === 201) {
        clearForm();
      }
    }
  }, [data]);

  return (
    <>
      {
        // isLoading ? (
        // <h3>Cargando...</h3>
        // ) :
        error ? (
          errorMessage()
        ) : (
          <>
            <div className="form-marco m-5">
              <h2 className="form-titulo">{title}</h2>
              <div className="container p-5">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label htmlFor="dni">Número de Documento</label>
                      <input
                        type="text"
                        className="form-control"
                        name="dni"
                        value={dni}
                        onChange={onInputChange}
                      />
                      {errorsInput.dni && (
                        <ValidateErrors errors={errorsInput.dni} />
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label htmlFor="nombre">Nombres </label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        placeholder="Ingrese Nombres"
                        value={nombre}
                        onChange={onInputChange}
                      />
                      {errorsInput.nombre && (
                        <ValidateErrors errors={errorsInput.nombre} />
                      )}{" "}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="inputName">Apelliodos </label>
                      <input
                        type="text"
                        className="form-control"
                        name="apellido"
                        placeholder="Ingrese Apellidos"
                        value={apellido}
                        onChange={onInputChange}
                      />
                      {errorsInput.apellido && (
                        <ValidateErrors errors={errorsInput.apellido} />
                      )}
                    </div>
                  </div>
                  <div className="row">
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
                    {/* <div className="form-group col-md-6">
                  <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fechaNacimiento"
                    step="1"
                    value={fechaNacimiento}
                    min="2013-01-01"
                    max="fechaNacimiento"
                    onChange={onInputChange}
                  />
                </div> */}
                  </div>
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label htmlFor="password">Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        placeholder="Indique su contraseña"
                        value={password}
                        onChange={onInputChange}
                      />
                      {errorsInput.password && (
                        <ValidateErrors errors={errorsInput.password} />
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="confirmPassword">
                        Confirmación de Contraseña
                      </label>
                      <input
                        type="confirmPassword"
                        className="form-control"
                        name="confirmPassword"
                        placeholder="Indique su contraseña"
                        value={confirmPassword}
                        onChange={onInputChange}
                      />
                      {errorsInput.confirmPassword && (
                        <ValidateErrors errors={errorsInput.confirmPassword} />
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="adress">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="adress"
                      placeholder="Indique su dirección principal"
                      value={adress}
                      onChange={onInputChange}
                    />
                  </div>

                  <div className="row">
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
                    <div className="form-group col-md-4">
                      <label htmlFor="condicion">Estátus</label>
                      <select
                        name="condicion"
                        className="form-control"
                        value={condicion}
                        onChange={onInputChange}
                      >
                        <option>Seleccióne opción</option>
                        <option>Actívo</option>
                        <option>No Actívo</option>
                      </select>
                    </div>
                  </div>
                  <div className="btn-submit mt-4">
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
            </div>
          </>
        )
      }
    </>
  );
}
