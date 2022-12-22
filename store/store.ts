import { configureStore } from '@reduxjs/toolkit'
import affairsReducer from './features/affairsReducer'
import projectsReducer from './features/projectsReducer'

export default configureStore({
    reducer: {
        affairs : affairsReducer,
        projects: projectsReducer
    }
})
