import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext';

export const AddUser = () => {
  const { getAllRoles, getAllClients } = useAuth();
  const [roleslist, setRoleslist] = useState([]);
  const [groups, setGroups] = useState();
  const [error, setError] = useState(null);

  const fetchRoles = async () => {
    try {
      const response = await getAllRoles();
      const data = await getAllClients();
      setRoleslist(response);
      setGroups(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const [formData, setFormData] = useState({
    team: '',
    addressLine1: '',
    addressLine2: '',
    timeZone: '',
    reportingManager: ''
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData);
  };


  // console.log(roleslist);

  // console.log(groups);

  return (
    <>
     
        <div className="container">
          <h4 className="mt-4 mb-4">Account Information</h4>
          <form>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="username">USERNAME: <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" id="username" placeholder="Enter username" required />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="fullname">FULLNAME: <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" id="fullname" placeholder="Enter full name" required />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="email">EMAIL ADDRESS: <span className="text-danger">*</span></label>
                  <input type="email" className="form-control" id="email" placeholder="Enter email" required />
                </div>
              </div>
            </div>
          </form>
        </div>


      <div className="container mt-4 ">
        {/* Status */}
        <div className="form-group">
          <label className="d-block">STATUS:</label>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="status"
              id="blocked"
              value="blocked"
            />
            <label className="form-check-label" htmlFor="blocked">
              Blocked
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="status"
              id="active"
              value="active"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="active">
              Active
            </label>
          </div>
        </div>

        {/* Roles */}
        <div className="form-group">
          <label className="d-block mb-4">ROLES:</label>
          {roleslist.roles && roleslist.roles.length > 0 ? (
            <div className="row">
              {roleslist.roles.map((item, index) => (
                <div className="col-md-2 mb-5" key={index}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`role_${index}`}
                    />
                    <label htmlFor={`role_${index}`}>
                      {item.role_name.replace(/_/g, '\u00A0').replace(/\b\w/g, (char) => char.toUpperCase())}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No roles available.</p>
          )}
        </div>


        <div className="form-group">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
            />
            <label className="d-block mb-4">Notify user of new account</label>
          </div>
        </div>


        <div className="form-group">
          <label htmlFor="userLevel" className='mb-2'>USER LEVEL: <span className="text-danger">*</span></label>
          <select className="form-control" id="userLevel" required>
            <option value="" selected>
              Choose
            </option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
            <option value="CL-1">CL-1</option>
            <option value="CL-2">CL-2</option>
            <option value="CL-3">CL-3</option>
            <option value="CL-4">CL-4</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
            <option value="M1">M1</option>
            <option value="M2">M2</option>
            <option value="ML1">ML1</option>
            <option value="T1">T1</option>
          </select>
        </div>


        {/* Groups */}
        <div className="form-group">
          <label className="d-block mb-4">Groups:</label>
          {groups && groups.length > 0 ? (
            <div className="row">
              {groups.map((item, index) => (
                <div className="col-md-4 mb-5" key={index}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`client_${item.client_id}`} // Use client_id for unique IDs
                    />
                    <label htmlFor={`client_${item.client_id}`}>
                      {item.client_name.replace(/_/g, '\u00A0').replace(/\b\w/g, (char) => char.toUpperCase())}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No groups available.</p>
          )}
        </div>





        <form onSubmit={handleSubmit}>
          {/* Team Section */}
          <div className="form-group">
            <label>SELECT TEAM FOR USER: <span className="text-danger">*</span></label>
            <select name="team" value={formData.team} onChange={handleChange} className="form-control" required>
              <option value="">Choose</option>
              <option value="6">LPM</option>
              <option value="7">MPM</option>
              <option value="8">BPM</option>
              <option value="9">VPM</option>
              <option value="12">IT/Corp</option>
            </select>
          </div>

          {/* Organization Details Section */}
          <div className="form-group row">
            <div className="col-md-6">
              <label>ADDRESS LINE1: <span className="text-danger">*</span></label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6">
              <label>ADDRESS LINE2:</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>


          {/* Locale Settings Section */}
          <div className="form-group">
            <label>TIME ZONE: <span className="text-danger">*</span></label>
            <select
              name="timeZone"
              value={formData.timeZone}
              onChange={handleChange}
              className="form-control"
              required
            >
                <option value="">Choose</option>
             <option value="Africa/Abidjan">Africa/Abidjan</option>
  <option value="Africa/Accra">Africa/Accra</option>
  <option value="Africa/Addis_Ababa">Africa/Addis_Ababa</option>
  <option value="Africa/Algiers">Africa/Algiers</option>
  <option value="Africa/Asmara">Africa/Asmara</option>
  <option value="Africa/Bamako">Africa/Bamako</option>
  <option value="Africa/Bangui">Africa/Bangui</option>
  <option value="Africa/Banjul">Africa/Banjul</option>
  <option value="Africa/Bissau">Africa/Bissau</option>
  <option value="Africa/Blantyre">Africa/Blantyre</option>

            </select>
          </div>

          <div className="form-group">
            <label>USER REPORTING MANAGER: <span className="text-danger">*</span></label>
            <select
              name="reportingManager"
              value={formData.reportingManager}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="" selected="selected">Choose</option>
  <option value="820">1cnklegal</option>
  <option value="2468">aaditya.s</option>
  <option value="1243">aaguilar</option>
  <option value="2165">aalbanese</option>
  <option value="1040">aarti.gu</option>
  <option value="2308">abayburtyan</option>
  <option value="2120">Abbie</option>

            </select>
          </div>

  
          <button type="submit" className="btn btn-primary">Create new account</button>
        </form>

<br />
      </div>

    </>
  )
}
