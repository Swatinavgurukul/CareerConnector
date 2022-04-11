import React from "react";
import { Link } from "react-router-dom";
import FooterUpdate from "../dashboard/_footer.jsx";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const Languages = (props) => {
    const { t } = useTranslation();
    return (
        <div class="w-100">
            <div className="container my-5">
                <div className="h2 pb-3">
                    {t(props.language?.layout?.language_heading)}
                </div>
                <div><Link>{t(props.language?.layout?.language_mexico)}</Link></div>
                <div className="py-2"><Link>{t(props.language?.layout?.language_brasil)}</Link></div>
                <div><Link>{t(props.language?.layout?.language_australia)}</Link></div>
                <div className="h2 pt-4 pb-3">
                    {t(props.language?.layout?.language_comingsoon)}
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <div>{t(props.language?.layout?.language_algeria)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_argentina)}</div>
                        <div>{t(props.language?.layout?.language_australia)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_belgie)}</div>
                        <div>{t(props.language?.layout?.language_belgique)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_bolivia)}</div>
                        <div>{t(props.language?.layout?.language_bonsa)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_brasil)}</div>
                        <div>{t(props.language?.layout?.language_canada_english)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_canada_french)}</div>
                        <div>{t(props.language?.layout?.language_ceskarepublika)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_chile)}</div>
                        <div>{t(props.language?.layout?.language_colombia)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_costarica)}</div>
                        <div>{t(props.language?.layout?.language_crnagora)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_cyprus)}</div>
                        <div>{t(props.language?.layout?.language_danmark)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_deutschland)}</div>
                        <div>{t(props.language?.layout?.language_ecuador)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_eesti)}</div>
                        <div>{t(props.language?.layout?.language_egypt)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_elsalvador)}</div>
                        <div>{t(props.language?.layout?.language_espana)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_france)}</div>
                        <div>{t(props.language?.layout?.language_guatemala)}</div>
                    </div>
                    <div className="col-md-3">
                        <div>{t(props.language?.layout?.language_gulf)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_honduras)}</div>
                        <div>{t(props.language?.layout?.language_hongkong)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_harvatska)}</div>
                        <div>{t(props.language?.layout?.language_india)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_indonaesia)}</div>
                        <div>{t(props.language?.layout?.language_ireland)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_island)}</div>
                        <div>{t(props.language?.layout?.language_italia)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_jordan)}</div>
                        <div>{t(props.language?.layout?.language_latvija)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_lebnon)}</div>
                        <div>{t(props.language?.layout?.language_lietuva)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_magayarorzag)}</div>
                        <div>{t(props.language?.layout?.language_malaysia)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_malta)}</div>
                        <div>{t(props.language?.layout?.language_mexico)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_morocco)}</div>
                        <div>{t(props.language?.layout?.language_nederlands)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_newzealand)}</div>
                        <div>{t(props.language?.layout?.language_nicaragua)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_nigeria)}</div>
                        <div>{t(props.language?.layout?.language_norge)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_osterreich)}</div>
                        <div>{t(props.language?.layout?.language_pakistan)}</div>
                    </div>
                    <div className="col-md-3">
                        <div>{t(props.language?.layout?.language_panama)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_paraguay)}</div>
                        <div>{t(props.language?.layout?.language_peru)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_philippines)}</div>
                        <div>{t(props.language?.layout?.language_polska)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_portugal)}</div>
                        <div>{t(props.language?.layout?.language_puertorico)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_republicadominicana)}</div>
                        <div>{t(props.language?.layout?.language_republicamoldova)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_romoania)}</div>
                        <div>{t(props.language?.layout?.language_saudiarabia)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_schweiz)}</div>
                        <div>{t(props.language?.layout?.language_singapore)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_slovenija)}</div>
                        <div>{t(props.language?.layout?.language_slovensko)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_southafrica)}</div>
                        <div>{t(props.language?.layout?.language_sarbija)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_srilanka)}</div>
                        <div>{t(props.language?.layout?.language_suisse)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_suomi)}</div>
                        <div>{t(props.language?.layout?.language_sverige)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_tunisia)}</div>
                        <div>{t(props.language?.layout?.language_turkiye)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_uk)}</div>
                        <div>{t(props.language?.layout?.language_us)}</div>
                    </div>
                    <div className="col-md-3">
                        <div>{t(props.language?.layout?.language_uruguay)}</div>
                        <div className="py-2">{t(props.language?.layout?.language_venezuela)}</div>
                        {/* {no_translated} */}
                        <div>Việt Nam - Tiếng việt</div>
                        {/* {no_translated} */}
                        <div className="py-2">Ελλάδα - Ελληνικά</div>
                        {/* {no_translated} */}
                        <div>Беларусь - Беларуская</div>
                        {/* {no_translated} */}
                        <div className="py-2">България - Български</div>
                        {/* {no_translated} */}
                        <div>Казахстан - Русский</div>
                        {/* {no_translated} */}
                        <div className="py-2">Россия - Русский</div>
                        {/* {no_translated} */}
                        <div>Україна - Українська</div>
                    </div>
                </div>
            </div>
            <FooterUpdate />
        </div>
    );
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
    };
}


export default connect(mapStateToProps)(Languages);
