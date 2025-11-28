import { useState, useEffect } from 'react';
import { useAlert } from '../../components/PromptAlert/AlertContext'
import LandingSubsController from '../../controller/LandingSubsController';
import './EditSubscription.css';
import '../../../public/styles/common.css';
import '../EditSubscription/EditSubscription.css';
import { TiTick } from "../../../public/Icons.js";

const { getAllsubscriptionsPlan, editSubscriptionsPlan } = LandingSubsController;

const EditSubscription = () => {
    const { showAlert } = useAlert()
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedData, setEditedData] = useState<any>({});
    const [error, setError] = useState<string>("");

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await getAllsubscriptionsPlan();
            const subscriptionsList = response?.SubscriptionPlan ?? [];
            setSubscriptions(subscriptionsList);
        } catch {
            setError("Failed to load SubscriptionsList.");
        }
    };

    const handleEditClick = (subscription: any) => {
        setEditingId(subscription.subsPlanID);
        setEditedData({...subscription});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedData({
            ...editedData,
            [name]: value
        });
    };

    const handleSave = async () => {
        try {
            const response = await editSubscriptionsPlan(editingId, editedData);
            // console.log(response)
            if(response.message === 'Succesfully updated subscription plan') {
                setSubscriptions(subscriptions.map(sub => 
                    sub.subsPlanID === editingId ? { ...sub, ...editedData } : sub
                ));
                setEditingId(null);
                showAlert(
                    "Update Subscriptions Plan Successfully",
                    "",
                    `${editedData.subscription_name} Updated Successfully`,
                    { type: 'success' }
                )
            }
        } catch (error) {
            showAlert(
                "handleSave",
                "Failed to Update Subscription Plan",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    const features: string[] = [
        "AI ChatBot",
        "Customisation",
        "Export Schedules",
        "Clock in & out",
        "Generate timesheet",
        "Shift swapping request",
        "Auto task assignation",
        "Leave management",
        "Task tracking",
    ];

    return (
        <div className="App-content">
            <div className="content">
                <h1>Subscriptions Plans Management</h1>
                <div className="subscription-plans-container">
                    {subscriptions.map((subscription) => (
                        <div className="subscription-plan-card" key={subscription.subsPlanID}>
                            <div className="card-header">
                                {editingId === subscription.subsPlanID ? (
                                    <input
                                        type="text"
                                        name="subscription_name"
                                        value={editedData.subscription_name}
                                        onChange={handleInputChange}
                                        className="edit-input"
                                    />
                                ) : (
                                    <p className="plan">{subscription.subscription_name}</p>
                                )}
                                <button 
                                    className="edit-button"
                                    onClick={() => editingId === subscription.subsPlanID ? 
                                        handleSave() : 
                                        handleEditClick(subscription)}
                                >
                                    {editingId === subscription.subsPlanID ? 'Save' : 'Edit'}
                                </button>
                            </div>
                            
                            {editingId === subscription.subsPlanID ? (
                                <>
                                    <input
                                        type="text"
                                        name="price"
                                        value={editedData.price}
                                        onChange={handleInputChange}
                                        className="edit-input"
                                    />
                                    <input
                                        type="text"
                                        name="subscription_plan_description"
                                        value={editedData.subscription_plan_description}
                                        onChange={handleInputChange}
                                        className="edit-input"
                                    />
                                </>
                            ) : (
                                <>
                                    <p className="price">${subscription.price} / month</p>
                                    <p className="emp-limit heart-beat">{subscription.subscription_plan_description}</p>
                                </>
                            )}
                            
                            <ul className="features-list1">
                                {features.map((feature, index) => (
                                    <li key={index}>
                                        <TiTick className="feature-tick"/> 
                                        <span className="feature-text">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            
                            {editingId === subscription.subsPlanID && (
                                <button className="cancel-button" onClick={handleCancel}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EditSubscription;