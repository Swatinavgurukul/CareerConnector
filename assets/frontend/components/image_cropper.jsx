import React from "react";
import Axios from "axios";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import ReactCrop from "react-image-crop";
import "react-image-crop/lib/ReactCrop.scss";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

const border_dashed = {
    borderStyle: "dashed",
};
class ImageCropper extends React.Component {
    constructor(props) {
        super(props);
        this.fileRef = React.createRef();
        this.state = {
            croppedImageUrl: "",
            cropperData: this.props.cropperData,
            cropResult: {},
            image: "",
            showCropper: false,
            cropData: "#",
            crop: {
                unit: "%",
                width: 30,
                aspect: 1,
            },
        };
    }
    ChooseFilehandleClick = () => {
        const fileElem = this.fileRef.current;
        if (fileElem) {
          fileElem.click();
        }
      }
    _crop(e) {
        // console.log(e);
        this.setState({
            cropResult: e.detail,
        });
    }
    fileValidation = () => {
        let fileInput = document.getElementById("file");
        let filePath = fileInput.value;
        // Allowing file type
        let allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
        if (!allowedExtensions.exec(filePath)) {
            toast.error(this.props.t(this.props.language?.layout?.toast16_nt));
            fileInput.value = "";
            return false;
        }
    };
    onImageChange = (e) => {
        // let image = this.state.image;
     if(e.target.files && e.target.files[0].size > 3000000){
        toast.error(this.props.t(this.props.language?.layout?.profile_maximum_nt))
        this.setState({ image: "", croppedImageUrl: "" });
        e.target.value = null;
        // this.props.changeImageUploadingStatus(false)
        this.closeModal();
        return
    }
        this.fileValidation();
        if (e.target.files && e.target.files.length > 0) {
            this.upload_file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                let image = reader.result;
                this.setState({ image: image, cropper: true });
            });
            reader.readAsDataURL(e.target.files[0]);
            // console.log("image is", e);
        }
    };

    saveCroppedImage = () => {
        // console.log(this.state.crop, "cropper data", this.scaleX, this.scaleY);
        this.props.noAvatars == false
            ? this.props.userImage == null || this.props.userImage == ""
                ? this.props.loadingSet(1)
                : this.props.changeImageUploadingStatus(true)
            : null;

        const formData = new FormData();
        formData.append("image", this.upload_file);
        formData.append(
            "cropx",
            (this.props.logoCropper ? this.props.crop.x * this.scaleX : this.state.crop.x * this.scaleX).toFixed(0)
        );
        formData.append(
            "cropy",
            (this.props.logoCropper ? this.props.crop.y * this.scaleY : this.state.crop.y * this.scaleY).toFixed(0)
        );
        formData.append(
            "height",
            (this.props.logoCropper
                ? this.props.crop.height * this.scaleX
                : this.state.crop.height * this.scaleX
            ).toFixed(0)
        );
        formData.append(
            "width",
            (this.props.logoCropper
                ? this.props.crop.width * this.scaleY
                : this.state.crop.width * this.scaleY
            ).toFixed(0)
        );
        formData.append("format", "png");
        // console.log(localStorage.getItem("access_token"), "  iddddddddddddd", formData);
        let profileEndpoint = `/api/v1/changeimage/${this.props.availability_id}`;
        let logoEndpoint = `api/v1/onboard/companylogo`;
        Axios.put(this.props.logoCropper ? logoEndpoint : profileEndpoint, formData, {
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((response) => {
                this.props.getData();
                this.props.noAvatars == false
                    ? this.props.userImage == null || this.props.userImage == ""
                        ? this.props.loadingSet(0)
                        : this.props.changeImageUploadingStatus(false)
                    : null;
                this.setState({ image: "", croppedImageUrl: "" });
                if (response.data.status === 200) {
                    this.props.logoCropper
                        ? toast.success(this.props.t(this.props.language?.layout?.toast17_nt))
                        : toast.success(this.props.t(this.props.language?.layout?.toast18_nt));
                }
            })
            .catch((error) => {
                if (error) {
                    this.props.logoCropper
                        ? toast.error(this.props.t(this.props.language?.layout?.toast19_nt))
                        : toast.error(this.props.t(this.props.language?.layout?.toast20_nt));
                }
                this.props.noAvatars == false
                    ? this.props.userImage == null || this.props.userImage == ""
                        ? this.props.loadingSet(0)
                        : this.props.changeImageUploadingStatus(false)
                    : null;
                this.setState({ image: "", croppedImageUrl: "" });
            });

        // this.setState(() => {
        //     this.props.closeModal();
        // });
        this.closeModal();
    };
    getCropData = () => {
        // console.log("croppperr ", this.state.cropper);
        if (typeof this.state.cropper !== "undefined") {
            this.setState({ image: this.state.cropper.getCroppedCanvas().toDataURL() });
        }
    };

    closeModal = () => {
        this.setState({ image: "", croppedImageUrl: "" }, () => {
            this.props.closeModal();
        });
    };

    onImageLoaded = (image) => {
        this.imageRef = image;
    };

    onCropComplete = (crop) => {
        // console.log(crop,"   onCropComplete",this.makeClientCrop(crop));
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        // console.log(crop);
        if (this.props.logoCropper) {
            this.props.onCrop(crop);
        } else {
            this.setState({ crop });
        }
    };

    makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = this.getCroppedImg(this.imageRef, crop, this.upload_file.name);
            // console.log(croppedImageUrl, "  croppedImageUrl");
            //   this.setState({croppedImageUrl: croppedImageUrl });
        }
    }
    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");
        this.scaleX = scaleX;
        this.scaleY = scaleY;

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
        // console.log(this.upload_file, "this.image.blob  ", crop.width * scaleX, crop.height * scaleY);

        // return((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                //reject(new Error('Canvas is empty'));
                console.error("Canvas is empty");
                return;
            }
            blob.name = fileName;
            window.URL.revokeObjectURL(this.fileUrl);
            this.fileUrl = window.URL.createObjectURL(blob);
            this.setState({ croppedImageUrl: this.fileUrl });
            return this.fileUrl;
        }, "image/jpeg");
        // });
    }

    render() {
        const { t } = this.props;
        const { image } = this.state;
        return (
            <div className="row">
                <Modal
                    show={this.props.openM}
                    onHide={() => {
                        this.closeModal();
                    }}
                    size={"lg"}>
                    <div
                        tabindex="-1"
                        id="modal_profile_image"
                        role="dialog"
                        aria-labelledby="myLargeModalLabel"
                        aria-hidden="true">
                        <div class="modal-dialog modal-lg m-0" role="document">
                            <div class="modal-content">
                                <div class="modal-header text-muted">
                                    <h5 class="modal-title ml-3" id="exampleModalLongTitle">
                                        {this.props.logoCropper ? t(this.props.language?.layout?.profile_upload_nt) : t(this.props.language?.layout?.profile_uploaduser_nt)}
                                    </h5>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={() => {
                                            this.closeModal();
                                        }}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body d-md-flex my-3">
                                    <div className="col-lg-8">
                                        {image !== "" ? (
                                            <div className="d-flex justify-content-end">
                                                <ReactCrop
                                                    src={this.state.image}
                                                    crop={this.props.logoCropper ? this.props.crop : this.state.crop}
                                                    ruleOfThirds
                                                    onImageLoaded={this.onImageLoaded}
                                                    onComplete={this.onCropComplete}
                                                    // style={{ display: "block", maxWidth: "80%",maxHeight:"80%" }}
                                                    onChange={this.onCropChange}
                                                />
                                                <button
                                                    className="position-absolute btn btn-danger rounded-0"
                                                    onClick={() => this.setState({ image: "", croppedImageUrl: "" })}>
                                                    x
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center text-muted ">
                                                <div className="py-5 bg-light" style={border_dashed}>
                                                    <h2 className="font-weight-bold py-2">{t(this.props.language?.layout?.profile_dragfiles_nt)}</h2>
                                                    <div className="py-2">
                                                        <img
                                                            src="/svgs/icons_new/upload.svg"
                                                            class="svg-sm mr-2 ml-0"
                                                        />
                                                    </div>

                                                    <h2 className="font-weight-bold py-4">Or</h2>
                                                    <label id="choose-button-text">
                                                    {/* {t(this.props.language?.layout?.seeker_choosefile)} */}
                                                        <input
                                                            type="file"
                                                            id="file"
                                                            ref={this.fileRef}
                                                            style={{display: 'none'}}
                                                            className="select-box-width"
                                                            name="file"
                                                            accept="image/jpeg,image/png"
                                                            onChange={this.onImageChange}
                                                            onClick={e => (e.target.value = null)}
                                                            multiple
                                                        />
                                                    </label>
                                                    <div>
                                                        <button id="ChooseFile" onClick={this.ChooseFilehandleClick}>{t(this.props.language?.layout?.seeker_choosefile)}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {/* <button className="btn btn-outline-secondary btn-block mt-4 p-12 d-flex justify-content-center">
                                            <img src="/svgs/icons_new/camera.svg" class="svg-xs mx-2 pt-1" />
                                            Use camera to click photo
                                        </button> */}
                                    </div>
                                    <div className="col-lg-4 flex-column text-center text-muted">
                                        <div className="bg-light mb-1 border" style={{ width: 200, height: 200 }}>
                                            {/* {!image && ( */}
                                            {this.state.croppedImageUrl && (
                                                <img
                                                    alt="Crop"
                                                    style={{ maxWidth: "100%", width: 200, height: 200 }}
                                                    src={this.state.croppedImageUrl}
                                                />
                                            )}
                                            {/* )} */}
                                            {/* <div
                                                className="img-preview bg-light"
                                                style={{ width: 200, height: 200 }}
                                            /> */}
                                        </div>

                                        <div className="text-muted text-left">
                                            <ul className="p-0 ">
                                                <ul>
                                                    <li> {t(this.props.language?.layout?.profile_choosefile_nt)}</li>
                                                    <li>{t(this.props.language?.layout?.profile_maximum_nt)}</li>
                                                </ul>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="modal-footer pb-2">
                                    <div class="col-md-2 m-2 p-0 text-right">
                                        <button
                                            class="btn btn-outline-secondary btn-block"
                                            onClick={() => {
                                                this.closeModal();
                                            }}>
                                            {t(this.props.language?.layout?.js_account_cancel)}
                                        </button>
                                    </div>
                                    <div class="col-md-2 m-2 p-0 text-right">
                                        <button
                                            class="btn btn-primary btn-block"
                                            onClick={() => this.saveCroppedImage()}>
                                            {t(this.props.language?.layout?.ep_setting_cd_save)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps, {})(withTranslation()(ImageCropper));
