
import "./channel.css";
import { useContext, useEffect, useState } from "react";
import EditChannel from "./EditChannel";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import * as services from "../../services/services";
import ChannelVideos from "./ChannelVideos";
import DefaultBanner from "../../assets/banner.png";
import DefaultProfile from "../../assets/default.png";

export default function Channel() {
    const { id } = useParams();
    const { state } = useContext(AppContext);
    const [currentChannel, setCurrentChannel] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [onEdit, setOnEdit] = useState(false);
    const [subStatus, setSubStatus] = useState(false);
    const authUser = state?.channel;
   console.log("id",id);
   
    console.log("Channel authUser:", authUser);

    useEffect(() => {
        loadCurrentChannel();
    }, [id, authUser]);

    const loadCurrentChannel = async () => {
        if (!id) return;
        try {
            if (id === authUser?._id) {
                setCurrentChannel(authUser);
                console.log("Using authUser from context:", authUser);
                return;
            }

            const res = await services.getChannelAsync(id);
            if (res.status === 200) {
                setCurrentChannel(res.data);
                if (authUser && res.data.subscribers.includes(authUser._id)) {
                    setSubStatus(true);
                } else {
                    setSubStatus(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubscribe = async () => {
        if (!currentChannel || !authUser) return;

        try {
            if (!subStatus) {
                const res = await services.subscribeChannelAsync(currentChannel._id);
                if (res.status === 200) {
                    setSubStatus(true);
                    setCurrentChannel((prev) => ({
                        ...prev,
                        subscribers: [...prev.subscribers, authUser._id],
                    }));
                }
            } else {
                const res = await services.unsubscribeChannelAsync(currentChannel._id);
                if (res.status === 200) {
                    setSubStatus(false);
                    setCurrentChannel((prev) => ({
                        ...prev,
                        subscribers: prev.subscribers.filter((sub) => sub !== authUser._id),
                    }));
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="channel">
            <div className="channel-wrapper container">
                <div className="banner">
                    <img
                        src={currentChannel?.banner||DefaultBanner }
                        alt="banner"
                    />
                </div>

                <div className="infos">
                    <img
                        src={currentChannel?.profile||DefaultProfile }
                        alt="avatar"
                        className="avatar"
                    />
                    <div className="details">
                        
                        <h4 className="channel-name">{currentChannel?.name}</h4>
                        <span className="stats">
  <strong>@ {currentChannel?.name || "channel"}</strong> · {currentChannel?.subscribers?.length || 0} subscribers · {currentChannel?.videos?.length || 0} videos
</span>
                        <p className="desc">{currentChannel?.desc}</p>
                        {authUser && currentChannel?._id === authUser?._id ? (
                            <button onClick={() => setOnEdit(true)}>Edit Channel</button>
                        ) : (
                            <button onClick={handleSubscribe}>
                                {subStatus ? "Unsubscribe" : "Subscribe"}
                            </button>
                        )}
                    </div>
                </div>

                <div className="tab-wrapper">
                    <div
                        className={tabIndex === 0 ? "tab-item active" : "tab-item"}
                        onClick={() => setTabIndex(0)}
                    >
                        <span>Videos</span>
                    </div>
                </div>

                <div className="tab-content">
                    <>
                    {tabIndex === 0 && <ChannelVideos channelId={id} />}
                  
                    </>
                </div>
            </div>

            {onEdit && (
                <EditChannel
                    user={currentChannel}
                    setUser={setCurrentChannel}
                    open={onEdit}
                    onClose={setOnEdit}
                />
            )}
        </div>
    );
}















