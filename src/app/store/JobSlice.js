import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch posts and like data asynchronously
export const fetchPosts = createAsyncThunk('job/fetchPosts', async () => {
  try {
    const response = await fetch('https://studysir.m3xtrader.com/api/studentpost_api.php');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch posts.');
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
});

// Like or unlike a post
// Like or unlike a post
// Like or unlike a post
export const likePost = createAsyncThunk('job/likePost', async ({ post_id, username }) => {
  const post_type = 'studentpost'; // Set the post_type

  try {
    const response = await fetch('https://studysir.m3xtrader.com/api/like_api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,  // Pass the username
        post_id,
        post_type,
      }),
    });

    const data = await response.json();
    console.log('API Response:', data); // Log API response

    if (response.ok && data.liked !== undefined) {
      return { post_id, liked: data.liked }; // Return the post_id and liked status
    } else {
      return { post_id, liked: false, error: data.error || 'Failed to like/unlike the post.' };
    }
  } catch (error) {
    console.error('Error in likePost:', error);
    return { post_id, liked: false, error: 'Network or server error.' };
  }
});



const jobSlice = createSlice({
  name: 'job',
  initialState: {
    jobData: [],
    likedPosts: [],
    likesCount: {},
    loading: false,
    error: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.jobData = action.payload;

        // Initialize the likes count for each post
        const likesData = {};
        action.payload.forEach((post) => {
          likesData[post.post_id] = post.likes;
        });
        state.likesCount = likesData;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Failed to load job data.';
      })

      // Handle liking/unliking a post
      .addCase(likePost.fulfilled, (state, action) => {
        const { post_id, liked, error } = action.payload;

        if (error) {
          // Log the error if there's an issue with liking/unliking the post
          state.error = error;
          console.error('Error from API:', error);
        } else if (liked) {
          state.likedPosts.push(post_id);
          state.likesCount[post_id] += 1;
        } else {
          state.likedPosts = state.likedPosts.filter((id) => id !== post_id);
          state.likesCount[post_id] -= 1;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = 'Network or server error occurred.';
      });
  }
});

export default jobSlice.reducer;
