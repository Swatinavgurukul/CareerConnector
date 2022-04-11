import React, { useState, useEffect } from "react";
// import Avatar from "avataaars-updated";
// import Avatar from "avataaars";
import options from "./avataaars_options.jsx";
import ReactCropper from "../../components/image_cropper.jsx";
import { Fragment } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

function avataaars(props) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(0);
    const [data, setData] = useState({});
    const [modalOpen, setmodalOpen] = useState();

    const newStyle = () => {
        setLoading(1);
        setTimeout(() => random(), 1500);
    };
    const loadingSet = (num) => {
        setLoading(num);
        props.changeImageUploadingStatus();
    };
    const random = () => {
        setLoading(0);
        let new_data = {
            topType: options.topType[Math.floor(Math.random() * options.topType.length)],
            accessoriesType: options.accessoriesType[Math.floor(Math.random() * options.accessoriesType.length)],
            hairColor: options.hairColor[Math.floor(Math.random() * options.hairColor.length)],
            facialHairType: options.facialHairType[Math.floor(Math.random() * options.facialHairType.length)],
            clotheType: options.clotheType[Math.floor(Math.random() * options.clotheType.length)],
            clotheColor: options.clotheColor[Math.floor(Math.random() * options.clotheColor.length)],
            eyeType: options.eyeType[Math.floor(Math.random() * options.eyeType.length)],
            eyebrowType: options.eyebrowType[Math.floor(Math.random() * options.eyebrowType.length)],
            mouthType: options.mouthType[Math.floor(Math.random() * options.mouthType.length)],
            skinColor: options.skinColor[Math.floor(Math.random() * options.skinColor.length)],
        };
        setData(new_data);
    };
    useEffect(() => {
        random();
    }, []);

    const checkfun = () => {
        // console.log(modalOpen);
        setmodalOpen(true);
        // console.log(modalOpen);
    };

    const closeModal = () => {
        setmodalOpen(false);
    };
    return (
        <div>
            {props.userProfile && (
                <Fragment>
                    <img src={props.userProfile} className="rounded rounded-circle w-100" alt="Profile Image" />
                    <div>
                        <button type="button" className="btn text-center" onClick={() => checkfun()}>
                            <img
                                src="/svgs/icons_new/camera.svg"
                                className="svg-xs"
                                title="Upload profile image"
                                alt="Upload profile image"
                            />
                        </button>
                    </div>
                    {
                        <ReactCropper
                            openM={modalOpen}
                            closeModal={closeModal}
                            userImage={props.userImage}
                            loadingSet={loadingSet}
                        />
                    }
                </Fragment>
            )}

            {!props.userProfile && (
                <Fragment>
                    <div className="d-flex justify-content-center flex-column text-center">
                        {/* <div className="profile-image mt-4rem pt-2"> */}
                        {/* <Avatar
                                avatarStyle="Circle"
                                topType={data.topType}
                                accessoriesType={data.accessoriesType}
                                hairColor={data.hairColor}
                                facialHairType={data.facialHairType}
                                clotheType={data.clotheType}
                                clotheColor={data.clotheColor}
                                eyeType={data.eyeType}
                                eyebrowType={data.eyebrowType}
                                mouthType={data.mouthType}
                                skinColor={data.skinColor}
                            /> */}
                        {/* <div className="rounded-circle mt-4rem mx-auto" style={{width: "150px", height: "150px",background:"#666666"}}> */}
                        {/* <img
                                    src="/images/profile_dummy.png"
                                    class="rounded-circle img-fluid"
                                    alt="User image"
                                    style={{width: "150px"}}
                                /> */}
                        {/* </div> */}
                        {loading ? (
                            <div class="bouncingLoader btn btn-dark btn-disabled mt-2">
                                <div></div>
                            </div>
                        ) : (
                            !props.userImage && (
                                <div className={`d-print-none mt-2 ${props.isPreviewMode ? "invisible" : ""}`}>
                                    {/* <button type="button" className="btn " onClick={(e) => newStyle()}>
                                    <img src="/svgs/icons_new/shuffle.svg" className="svg-xs svg-gray" title="Shuffle" />
                                </button> */}
                                    <button type="button" className="btn btn-dark py-1" onClick={() => checkfun()}>
                                        <img
                                            src="/svgs/icons_new/camera.svg"
                                            alt="Upload profile image"
                                            alt="Upload profile image"className="svg-xs invert-color mr-2 mt-n1"
                                            title="Upload profile image"
                                        />
                                       {t(props.language?.layout?.ep_setting_bd_upload)}{" "}
                                    </button>
                                </div>
                            )
                        )}

                        {
                            <ReactCropper
                                openM={modalOpen}
                                closeModal={closeModal}
                                loadingSet={loadingSet}
                                userImage={props.userImage}
                                availability_id={props.availability_id}
                                getData={props.getData}
                                changeImageUploadingStatus={props.changeImageUploadingStatus}
                            />
                        }
                    </div>
                </Fragment>
            )}
        </div>
    );
}

function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
    };
}
export default connect(mapStateToProps, {})(avataaars);