import axios from 'axios';
import jwt_decode from "jwt-decode";
import { res } from 'react-email-validator';

export const getUserDetails = ()=> {
    const token = localStorage.getItem('access_token')

    let options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const {user_id} = jwt_decode(token);
    // console.log(jwt_decode(token))
   return axios
        .get(`/api/v1/users/profile/${user_id}`, options)
        .then(res=> res.data)
        .catch(err=> console.log(err))
}

export const checkUserEmail = (formdata)=> {
      return axios
                 .post("/api/v1/checkemail", formdata)
                 .then(res=> res.data)
                 .catch(err=> console.log(err))

}

export const resumeUpload = (formdata)=> {
    const token = localStorage.getItem('access_token')

    let options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const {user_id} = jwt_decode(token);
      return axios.put(`/api/v1/uploadresume/${user_id}`, formdata, options)
                  .then(res=> res.data)

}


export const jobApply = (formData, slug)=> {
    let access_token = localStorage.getItem("access_token")

    let options = {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    };
    return axios.post(`/api/v1/jobs/${slug}/apply`, formData, options)
    .then(res=> res.data)
    .catch(err=> console.log(err))
}

export const checkApply = (slug)=> {
     let options = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        };

  return axios
        .get(`/api/v1/jobs/applied/${slug}`, options)
        .then(res=> res.data)
        .catch(err=> console.log(err));
}