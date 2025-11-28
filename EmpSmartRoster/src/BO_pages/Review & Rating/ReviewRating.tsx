import { useState, useEffect } from 'react'
import { useAuth } from '../../AuthContext'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { formatTextForDisplay, USER_ROLE, generateSGDateTimeForDateTimeInput, formatDateTime } from '../../controller/Variables.js'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton/SecondaryButton'
import ReviewRatingController from '../../controller/Review_Rating/ReviewRatingController'

import { FaStar } from "react-icons/fa";
import { IoClose } from '../../../public/Icons.js'
import './ReviewRating.css'
import '../../../public/styles/common.css'

const { viewReviewRating, submitReviewRating, saViewReviewRating } = ReviewRatingController

const ReviewRating = () => {
    const { showAlert } = useAlert();
    const { user } = useAuth();
    const [ showPopupCreateReviewRating, setShowPopupCreateReviewRating ] = useState(false)
    const [ showConfirmation, setShowConfirmation ] = useState(false)
    const [ hover, setHover ] = useState<number>(0)
    const [ rating, setRating ] = useState<number>(0)
    const [ review, setReview ] = useState<string>('')
    const [ allReview, setAllReview ] = useState<any>('')

    // Show create form on submit review and rating
    function toggleShowPopupCreateForm() {
        setShowPopupCreateReviewRating(!showPopupCreateReviewRating)
    }
    // Show confirmation on submit review and rating
    function toggleShowConfirmation() {
        setShowConfirmation(!showConfirmation)
    }

    const handleStarClick = (index: number) => {
        setRating(index);
    };

    const handleStarHover = (index: number) => {
        setHover(index);
    };

    const handleStarLeave = () => {
        setHover(0);
    };

    const submitReview = async() => {
        try{
            let response = await submitReviewRating (user?.UID, rating, review)
            // console.log(response)
            if(response.message === 'Review inserted successfully'){
                showAlert(
                    'Review and Rating Submitted Successfully',
                    `Your Review Had Been Posted`,
                    `Thanks for your feedback ^_^`,
                    { type: 'success' }
                )
                setRating(0)
                setReview('')
                toggleShowPopupCreateForm()
                toggleShowConfirmation()
            }
        } catch(error) {
            showAlert(
                'submitReview',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    const fetchReview = async() => {
        try{
            let response = await viewReviewRating (user?.UID)
            // console.log(response)
            if(response.message === 'Review retrieved successfully'){
                response = response.reviewList || []
                setAllReview(response)
            }
        } catch(error) {
            showAlert(
                'submitReview',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    const fetchSAReview = async() => {
        try{
            let response = await saViewReviewRating ()
            // console.log(response)
            response = response.ReviewAndRatingList || []
            setAllReview(response)
        } catch(error) {
            showAlert(
                'submitReview',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    useEffect(() => {
        if(user?.role === USER_ROLE[1])
            fetchReview() // fetch bo reviews and rating
        if(user?.role === USER_ROLE[0])
            fetchSAReview() // fetch sa reviews and rating
    }, [user])

    if(showConfirmation) return (
        <div className="App-popup" onClick={toggleShowConfirmation}>
            <div className="App-popup-prompt-content confirm-user-profile-completion" onClick={(e) => e.stopPropagation()}>
                <p className="App-prompt-confirmation-title App-header">
                    Confirm on Submit the Review and Rating
                </p>
                <div className="confirmation-detail">
                    <div className='submit-rating-star'>
                        {[...Array(rating)].map((_, index) => (
                            <FaStar 
                                key={index}
                                className="submit-rating-star-icon"
                                size={24} 
                                color="#FFD700" 
                            />
                        ))}
                    </div>
                    
                    <p className="main-data" dangerouslySetInnerHTML={{ __html: formatTextForDisplay(review) }}/>
                </div>
                <div className="btns-grp">
                    <PrimaryButton 
                        text='Confirm'
                        onClick={() => submitReview()}
                    />
                    <SecondaryButton 
                        text='Cancel'
                        onClick={() => toggleShowConfirmation()}
                    />
                </div>
            </div>
        </div>
    )

    return(
        <div className="App-content">
            <div className="content">
                <div className="review-rating-header">
                    {user?.role  === USER_ROLE[1] ? (
                        <h1>Review & Rating Management</h1>
                    ):(<h1>View All Review & Rating</h1>)}
                    {user?.role  === USER_ROLE[1] && (
                        <PrimaryButton 
                            text='Create Review & Rating'
                            onClick={toggleShowPopupCreateForm}
                        />
                    )}
                </div>

                {allReview.length > 0 ? (
                    <div className='bo-view-review-n-rating-container'>
                    {allReview.map((review: any) => (
                        <div className="card review-n-rating-cards" key={review.reviewID}>
                            <div className="rating-n-createdate">
                                <div className='submit-rating-star'>
                                    {[...Array(review.rating)].map((_, index) => (
                                        <FaStar 
                                            key={index}
                                            className="submit-rating-star-icon"
                                            size={24} 
                                            color="#FFD700" 
                                        />
                                    ))}
                                </div>
                                <p className='bo-sa-review-rating-create-time'>{formatDateTime(generateSGDateTimeForDateTimeInput(review.createdOn))}</p>
                            </div>
                            
                            <p className="main-data" dangerouslySetInnerHTML={{ __html: formatTextForDisplay(review.review) }}/>
                            {user?.role  === USER_ROLE[0] && (<p className="main-data">by <strong>{review.fullName}</strong></p>)}
                        </div>
                    ))}
                    </div>
                ):(<>No Review and Rating Submitted Before</>)}
            </div>

            {/* Show Submit Review and Rating Popup */}
            {showPopupCreateReviewRating && (
                <div className='App-popup' onClick={toggleShowPopupCreateForm}>
                    <div className="App-popup-content" onClick={(e) => e.stopPropagation()}>
                        <div className="App-header">
                            <h1>Submit Review and Rating</h1>
                            <div className="suspend-btn">
                                <button className="icons" onClick={toggleShowPopupCreateForm}>
                                    <IoClose />
                                </button>
                            </div>
                        </div>
                        <div className="App-popup-main-content review-and-rating-create-form">
                            <div className='forms-input'>
                                <strong>
                                    Rating
                                </strong>
                                <div className="submit-rating-star">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar 
                                            key={star}
                                            className="submit-rating-star-icon"
                                            color={(hover || rating) >= star ? "#FFD700" : "#e4e5e9"}
                                            onClick={() => handleStarClick(star)}
                                            onMouseEnter={() => handleStarHover(star)}
                                            onMouseLeave={handleStarLeave}
                                            style={{ cursor: "pointer" }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Input for Review */}
                            <div className='forms-input'>
                                <strong>
                                    Review <span style={{ color: 'red' }}>*</span>
                                </strong>
                                <textarea name='Review'
                                    maxLength={500}
                                    rows={4}
                                    placeholder='Review' 
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="btns-grp">
                            <PrimaryButton 
                                text='Submit'
                                disabled={!review}
                                onClick={() => toggleShowConfirmation()}
                            />
                            <SecondaryButton 
                                text='Cancel'
                                onClick={() => toggleShowPopupCreateForm()}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default ReviewRating