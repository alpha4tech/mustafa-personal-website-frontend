<template>
  <section id="blog" class="blog-section" :class="{ 'rtl-blog': isRtl }">

    <!-- ── Background Decoration ── -->
    <div class="bg-deco" aria-hidden="true">
      <div class="deco-orb orb-1"></div>
      <div class="deco-orb orb-2"></div>
      <div class="deco-orb orb-3"></div>
      <div class="deco-grid"></div>
    </div>

    <div class="container">

      <!-- ── Section Header ── -->
      <div class="sec-header" data-aos="fade-up">
        <div class="sec-badge">
          <span class="badge-dot"></span>
          <span>{{ t.blogBadge }}</span>
        </div>
        <h2 class="sec-title">
          {{ t.blogTitlePrefix }}
          <span class="title-highlight">{{ t.blogTitleHighlight }}</span>
        </h2>
        <p class="sec-sub">{{ t.blogSubtitle }}</p>
      </div>

      <!-- ── Filter Bar ── -->
      <div class="filter-wrap" data-aos="fade-up" data-aos-delay="60">
        <button
          :class="['filter-btn', { active: activeFilter === 'all' }]"
          @click="setFilter('all')"
        >
          <span class="btn-icon"></span>
          <span class="btn-label">{{ t.filterAll || 'الكل' }}</span>
          <span class="btn-count">{{ allPosts.length }}</span>
        </button>

        <button
          v-for="cat in apiCategories"
          :key="cat.id"
          :class="['filter-btn', { active: activeFilter === cat.id }]"
          @click="setFilter(cat.id)"
        >
          <span class="btn-icon">{{ getCatIcon(cat) }}</span>
          <span class="btn-label">{{ isRtl ? cat.name_ar : cat.name_en }}</span>
          <span class="btn-count">{{ getCatCount(cat.id) }}</span>
        </button>
      </div>

      <!-- ── Loading Skeleton ── -->
      <div v-if="loading" class="skeleton-wrap">
        <div class="skeleton-featured">
          <div class="skel skel-img-big"></div>
          <div class="skel-body">
            <div class="skel skel-badge"></div>
            <div class="skel skel-title-lg"></div>
            <div class="skel skel-line"></div>
            <div class="skel skel-line short"></div>
          </div>
        </div>
        <div class="skeleton-grid">
          <div v-for="i in 3" :key="i" class="skel-card">
            <div class="skel skel-img"></div>
            <div class="skel skel-badge"></div>
            <div class="skel skel-title"></div>
            <div class="skel skel-line"></div>
          </div>
        </div>
      </div>

      <template v-else>
        <!-- ── Featured Layout (All filter only) ── -->
        <div
          v-if="activeFilter === 'all' && featuredPost"
          class="blog-layout"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <!-- Featured Post -->
          <article class="post-featured" @click="openPost(featuredPost)">
            <div class="feat-img-box">
              <img
                :src="postImage(featuredPost)"
                :alt="postTitle(featuredPost)"
                class="feat-img"
                loading="lazy"
              />
              <div class="feat-overlay"></div>
              <span class="p-cat-tag">{{ postCategoryName(featuredPost) }}</span>
              <span class="feat-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                {{ t.featured || (isRtl ? 'مميز' : 'Featured') }}
              </span>
              <div class="feat-read-time">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ readTime(featuredPost) }} {{ t.minRead || 'د' }}
              </div>
            </div>
            <div class="p-body">
              <div class="p-meta">
                <span class="p-cat">{{ postCategoryName(featuredPost) }}</span>
                <span class="p-sep">•</span>
                <span class="p-info">{{ formatDate(featuredPost.published_at) }}</span>
                <span class="p-sep">•</span>
                <span class="p-info">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  {{ formatViews(featuredPost.views_count) }}
                </span>
              </div>
              <h3 class="p-title feat-title">{{ postTitle(featuredPost) }}</h3>
              <p class="p-excerpt">{{ postExcerpt(featuredPost) }}</p>
              <div class="p-footer">
                <div class="p-author">
                  <div class="p-avatar">M</div>
                  <div>
                    <span class="p-aname">{{ t.heroName || 'Mustafa' }}</span>
                    <span class="p-arole">{{ t.srvMarketingTitle || 'Digital Marketer' }}</span>
                  </div>
                </div>
                <button class="p-readbtn">
                  {{ t.readMore || 'اقرأ المزيد' }}
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </article>

          <!-- Side Posts -->
          <div class="side-col">
            <article
              v-for="post in sidePosts"
              :key="post.id"
              class="post-side"
              @click="openPost(post)"
            >
              <div class="side-img-box">
                <img :src="postImage(post)" :alt="postTitle(post)" class="side-img" loading="lazy" />
                <div class="side-overlay"></div>
                <span class="p-cat-tag sm">{{ postCategoryName(post) }}</span>
              </div>
              <div class="side-body">
                <div class="p-meta">
                  <span class="p-info">{{ formatDate(post.published_at) }}</span>
                  <span class="p-sep">•</span>
                  <span class="p-info">{{ readTime(post) }} {{ t.minRead || 'د' }}</span>
                </div>
                <h4 class="side-title">{{ postTitle(post) }}</h4>
                <p class="side-exc">{{ postExcerpt(post) }}</p>
                <div class="side-foot">
                  <div class="p-tags">
                    <span
                      v-for="tag in postTags(post).slice(0, 2)"
                      :key="tag.id || tag"
                      class="tag"
                    >{{ isRtl ? (tag.name_ar || tag) : (tag.name_en || tag) }}</span>
                  </div>
                  <span class="side-arr">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- ── Posts Grid ── -->
        <div v-if="gridPosts.length > 0" class="posts-grid">
          <TransitionGroup name="card-pop" appear tag="div" class="grid-inner">
            <article
              v-for="(post, i) in gridPosts"
              :key="post.id"
              class="post-card"
              :style="{ '--delay': i * 70 + 'ms' }"
              @click="openPost(post)"
            >
              <div class="card-img-box">
                <img :src="postImage(post)" :alt="postTitle(post)" class="card-img" loading="lazy" />
                <div class="card-overlay">
                  <div class="c-read-lbl">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    {{ t.readMore || 'اقرأ' }}
                  </div>
                </div>
                <span class="p-cat-tag">{{ postCategoryName(post) }}</span>
                <div class="card-read-time">{{ readTime(post) }} {{ t.minRead || 'د' }}</div>
              </div>
              <div class="p-body">
                <div class="p-meta">
                  <span class="p-cat">{{ postCategoryName(post) }}</span>
                  <span class="p-sep">•</span>
                  <span class="p-info">{{ readTime(post) }} {{ t.minRead || 'د' }}</span>
                </div>
                <h3 class="p-title">{{ postTitle(post) }}</h3>
                <p class="p-excerpt clamp2">{{ postExcerpt(post) }}</p>
                <div class="p-footer">
                  <div class="p-meta-foot">
                    <span class="p-info">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      {{ t.heroName || 'Mustafa' }}
                    </span>
                    <span class="p-info">{{ formatDate(post.published_at) }}</span>
                  </div>
                  <button class="p-link">
                    {{ t.readMore || 'اقرأ' }}
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          </TransitionGroup>
        </div>

        <!-- ── Empty State ── -->
          <div v-if="!loading && allPosts.length === 0" class="empty-state">
          <div class="empty-icon-wrap">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </div>
          <h3>{{ t.noPostsYet || (isRtl ? 'لا توجد مقالات' : 'No posts yet') }}</h3>
          <p>{{ t.noPostsDesc || (isRtl ? 'سيتم إضافة مقالات قريباً' : 'New articles coming soon') }}</p>
        </div>

        <!-- ── Load More ── -->
        <div v-if="hasMore" class="load-wrap">
          <button class="load-btn" :disabled="loadingMore" @click="loadMore">
            <svg
              v-if="!loadingMore"
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            ><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            <span v-if="loadingMore" class="spin-sm"></span>
            {{ t.loadMore || 'تحميل المزيد' }}
          </button>
        </div>

      </template>

      <!-- ── Newsletter ── -->
      <div class="newsletter-card" data-aos="fade-up">
        <div class="nl-dots"></div>
        <div class="nl-glow"></div>
        <div class="nl-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E7AE18" stroke-width="1.8" stroke-linecap="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <div class="nl-text">
          <h4>{{ t.newsletterTitle }}</h4>
          <p>{{ t.newsletterDesc }}</p>
        </div>
        <div class="nl-form">
          <input
            v-model="nlEmail"
            type="email"
            :placeholder="t.emailPlaceholder"
            @keyup.enter="subscribeNewsletter"
          />
          <button @click="subscribeNewsletter" :class="{ done: nlSubscribed }">
            <span v-if="!nlSubscribed">{{ t.subscribe }}</span>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
        </div>
      </div>

    </div>

    <!-- ── Post Modal ── -->
    <Transition name="modal-pop">
      <div v-if="selectedPost" class="modal-overlay" @click.self="closePost">
        <div class="modal-box" :class="{ 'rtl-modal': isRtl }">

          <button class="m-close" @click="closePost" :title="t.close || 'إغلاق'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>

          <!-- Image -->
          <div class="m-img-box">
            <img :src="postImage(selectedPost)" :alt="postTitle(selectedPost)" class="m-img" />
            <div class="m-img-ov"></div>
            <div class="m-img-meta">
              <span class="m-cat-tag">{{ postCategoryName(selectedPost) }}</span>
              <span class="m-read-time">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ readTime(selectedPost) }} {{ t.minRead || 'د' }}
              </span>
            </div>
          </div>

          <!-- Body -->
          <div class="m-body">
            <div class="m-meta-row">
              <span class="p-cat">{{ postCategoryName(selectedPost) }}</span>
              <span class="p-sep">•</span>
              <span class="p-info">{{ formatDate(selectedPost.published_at) }}</span>
              <span class="p-sep">•</span>
              <span class="p-info">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                {{ formatViews(selectedPost.views_count) }}
              </span>
            </div>

            <h2 class="m-title">{{ postTitle(selectedPost) }}</h2>
            <p class="m-excerpt">{{ postExcerpt(selectedPost) }}</p>

            <div class="m-divider"></div>

            <div
              v-if="postContent(selectedPost)"
              class="m-content"
              v-html="postContent(selectedPost)"
            ></div>

            <div v-if="postTags(selectedPost).length" class="m-tags">
              <span
                v-for="tag in postTags(selectedPost)"
                :key="tag.id || tag"
                class="tag"
              >#{{ isRtl ? (tag.name_ar || tag) : (tag.name_en || tag) }}</span>
            </div>

            <div class="m-author-row">
              <div class="p-avatar large">M</div>
              <div>
                <span class="p-aname">{{ t.heroName || 'Mustafa' }}</span>
                <span class="p-arole">{{ t.srvMarketingTitle || 'Digital Marketer' }}</span>
              </div>
            </div>

            <div class="m-actions">
              <button class="m-cta" @click="$emit('scrollTo', 'contact')">
                {{ t.contactMe || 'تواصل معي' }}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="m-cls-btn" @click="closePost">
                {{ t.close || (isRtl ? 'إغلاق' : 'Close') }}
              </button>
            </div>

            <!-- ── Comments Section (inside modal) ── -->
            <div class="comments-section">
              <div class="comments-header">
                <h4 class="comments-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  {{ isRtl ? 'التعليقات' : 'Comments' }}
                  <span class="comments-count">{{ comments.length }}</span>
                </h4>
              </div>

              <!-- Loading -->
              <div v-if="commentsLoading" class="comments-loading">
                <div class="spin-sm"></div>
              </div>

              <!-- Comments List -->
              <div v-else-if="comments.length" class="comments-list">
                <div v-for="c in comments" :key="c.id" class="comment-item">
                  <div class="comment-avatar">{{ c.name.charAt(0).toUpperCase() }}</div>
                  <div class="comment-body">
                    <div class="comment-meta">
                      <span class="comment-name">{{ c.name }}</span>
                      <span class="comment-date">{{ c.created_at }}</span>
                    </div>
                    <p class="comment-text">{{ c.comment }}</p>
                    <button class="reply-trigger" @click="setReply(c)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 17 4 12 9 7"/>
                        <path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
                      </svg>
                      {{ isRtl ? 'رد' : 'Reply' }}
                    </button>

                    <!-- Nested Replies -->
                    <div v-if="c.replies?.length" class="replies-list">
                      <div v-for="r in c.replies" :key="r.id" class="reply-item">
                        <div class="comment-avatar reply-avatar">{{ r.name.charAt(0).toUpperCase() }}</div>
                        <div class="comment-body">
                          <div class="comment-meta">
                            <span class="comment-name">{{ r.name }}</span>
                            <span class="comment-date">{{ r.created_at }}</span>
                          </div>
                          <p class="comment-text">{{ r.comment }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="no-comments">
                {{ isRtl ? 'لا توجد تعليقات بعد. كن أول من يعلق!' : 'No comments yet. Be the first!' }}
              </div>

              <!-- Success Message -->
              <div v-if="commentSuccess" class="comment-success">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ isRtl ? 'تم إرسال تعليقك وسيظهر بعد المراجعة' : 'Comment submitted and will appear after review' }}
              </div>

              <!-- Comment Form -->
               <!-- Comment Form -->
<div v-if="!commentSuccess" class="comment-form">

  <!-- مرحباً مجدداً إذا كان الاسم محفوظاً -->
  <div v-if="savedName" class="commenter-greeting">
    <div class="cg-avatar">{{ savedName.charAt(0).toUpperCase() }}</div>
    <div class="cg-info">
      <span class="cg-name">{{ isRtl ? `مرحباً، ${savedName}` : `Welcome back, ${savedName}` }}</span>
      <button class="cg-change" @click="clearSavedCommenter">
        {{ isRtl ? 'تغيير الاسم' : 'Not you?' }}
      </button>
    </div>
  </div>

  <h5 class="form-title">
    {{ replyingTo
      ? (isRtl ? `ردًا على ${replyingTo.name}` : `Replying to ${replyingTo.name}`)
      : (isRtl ? 'أضف تعليقاً' : 'Add a comment') }}
  </h5>

  <div v-if="replyingTo" class="reply-banner">
    <span>{{ isRtl ? `رد على: ${replyingTo.name}` : `Reply to: ${replyingTo.name}` }}</span>
    <button type="button" @click="cancelReply">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </button>
  </div>

  <!-- حقول الاسم والإيميل — تظهر فقط إذا لم تكن محفوظة -->
  <div v-if="!savedName" class="cf-row">
    <div class="cf-field">
      <input
        v-model="commentForm.name"
        type="text"
        :placeholder="isRtl ? 'الاسم *' : 'Name *'"
        :class="{ 'cf-error': commentErrors.name }"
      />
      <span v-if="commentErrors.name" class="cf-err-msg">{{ commentErrors.name }}</span>
    </div>
    <div class="cf-field">
      <input
        v-model="commentForm.email"
        type="email"
        :placeholder="isRtl ? 'البريد الإلكتروني *' : 'Email *'"
        :class="{ 'cf-error': commentErrors.email }"
      />
      <span v-if="commentErrors.email" class="cf-err-msg">{{ commentErrors.email }}</span>
    </div>
  </div>

  <div class="cf-field">
    <textarea
      v-model="commentForm.comment"
      :placeholder="isRtl ? 'اكتب تعليقك هنا...' : 'Write your comment here...'"
      rows="3"
      :class="{ 'cf-error': commentErrors.comment }"
    ></textarea>
    <span v-if="commentErrors.comment" class="cf-err-msg">{{ commentErrors.comment }}</span>
  </div>

  <button class="cf-submit" :disabled="submittingComment" @click="submitComment">
    <span v-if="submittingComment" class="spin-sm"></span>
    <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
    {{ submittingComment
      ? (isRtl ? 'جاري الإرسال...' : 'Sending...')
      : (isRtl ? 'إرسال التعليق' : 'Submit Comment') }}
  </button>
</div>
              <!-- <div v-if="!commentSuccess" class="comment-form">
                <h5 class="form-title">
                  {{ replyingTo
                    ? (isRtl ? `ردًا على ${replyingTo.name}` : `Replying to ${replyingTo.name}`)
                    : (isRtl ? 'أضف تعليقاً' : 'Add a comment') }}
                </h5>

                <div v-if="replyingTo" class="reply-banner">
                  <span>{{ isRtl ? `رد على: ${replyingTo.name}` : `Reply to: ${replyingTo.name}` }}</span>
                  <button type="button" @click="cancelReply">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                <div class="cf-row">
                  <div class="cf-field">
                    <input
                      v-model="commentForm.name"
                      type="text"
                      :placeholder="isRtl ? 'الاسم *' : 'Name *'"
                      :class="{ 'cf-error': commentErrors.name }"
                    />
                    <span v-if="commentErrors.name" class="cf-err-msg">{{ commentErrors.name }}</span>
                  </div>
                  <div class="cf-field">
                    <input
                      v-model="commentForm.email"
                      type="email"
                      :placeholder="isRtl ? 'البريد الإلكتروني *' : 'Email *'"
                      :class="{ 'cf-error': commentErrors.email }"
                    />
                    <span v-if="commentErrors.email" class="cf-err-msg">{{ commentErrors.email }}</span>
                  </div>
                </div>
                <div class="cf-field">
                  <textarea
                    v-model="commentForm.comment"
                    :placeholder="isRtl ? 'اكتب تعليقك هنا...' : 'Write your comment here...'"
                    rows="3"
                    :class="{ 'cf-error': commentErrors.comment }"
                  ></textarea>
                  <span v-if="commentErrors.comment" class="cf-err-msg">{{ commentErrors.comment }}</span>
                </div>
                <button class="cf-submit" :disabled="submittingComment" @click="submitComment">
                  <span v-if="submittingComment" class="spin-sm"></span>
                  <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  {{ submittingComment
                    ? (isRtl ? 'جاري الإرسال...' : 'Sending...')
                    : (isRtl ? 'إرسال التعليق' : 'Submit Comment') }}
                </button>
              </div> -->
            </div>
            <!-- ── End Comments Section ── -->

          </div><!-- end m-body -->
        </div><!-- end modal-box -->
      </div>
    </Transition>

  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { publicAxios } from '@/api/axios'

// ── Props ─────────────────────────────────────
const props = defineProps({
  t:     { type: Object,  required: true },
  isRtl: { type: Boolean, default: false },
})
defineEmits(['scrollTo'])

// ── State ─────────────────────────────────────
const allPosts      = ref([])
const apiCategories = ref([])
const activeFilter  = ref('all')
const page          = ref(1)
const lastPage      = ref(1)
const loading       = ref(true)
const loadingMore   = ref(false)
const selectedPost  = ref(null)
const nlEmail       = ref('')
const nlSubscribed  = ref(false)

// ── Comments State ────────────────────────────
const comments          = ref([])
const commentsLoading   = ref(false)
const commentErrors     = ref({})
const commentSuccess    = ref(false)
const submittingComment = ref(false)
const replyingTo        = ref(null)

// ── استرجاع البيانات المحفوظة من localStorage ──
const savedName  = localStorage.getItem('commenter_name')  || ''
const savedEmail = localStorage.getItem('commenter_email') || ''

const savedNameRef  = ref(localStorage.getItem('commenter_name')  || '')

// واستخدم savedNameRef.value في الـ template بدل savedName

const commentForm = ref({
  name:      savedName,
  email:     savedEmail,
  comment:   '',
  parent_id: null,
})


// ── Computed ──────────────────────────────────
const featuredPost = computed(() =>
  allPosts.value.find(p => p.is_featured) || allPosts.value[0] || null
)

const sidePosts = computed(() => {
  if (!featuredPost.value) return []
  return allPosts.value
    .filter(p => p.id !== featuredPost.value.id)
    .slice(0, 2)
})

const gridPosts = computed(() => {
  if (activeFilter.value === 'all') {
    const excluded = new Set([
      featuredPost.value?.id,
      ...sidePosts.value.map(p => p.id),
    ])
    return allPosts.value.filter(p => !excluded.has(p.id))
  }
  return allPosts.value
})

const hasMore = computed(() => page.value < lastPage.value)

const totalViews = computed(() => {
  const total = allPosts.value.reduce((sum, p) => sum + (p.views_count || 0), 0)
  if (total >= 1000) return (total / 1000).toFixed(1) + 'K'
  return String(total)
})

const clearSavedCommenter = () => {
  localStorage.removeItem('commenter_name')
  localStorage.removeItem('commenter_email')
  commentForm.value.name  = ''
  commentForm.value.email = ''
  // نعيد تحميل savedName عبر ref
  savedNameRef.value = ''
}

// ── Helpers ───────────────────────────────────
const postTitle = (p) => {
  if (!p) return ''
  return props.isRtl ? (p.title_ar || p.title_en || '') : (p.title_en || p.title_ar || '')
}

const postExcerpt = (p) => {
  if (!p) return ''
  return props.isRtl ? (p.excerpt_ar || p.excerpt_en || '') : (p.excerpt_en || p.excerpt_ar || '')
}

const postContent = (p) => {
  if (!p) return ''
  return props.isRtl ? (p.content_ar || p.content_en || '') : (p.content_en || p.content_ar || '')
}

const postImage = (p) =>
  p?.featured_image || `https://picsum.photos/seed/${p?.id || 1}/800/500`

const postCategoryName = (p) => {
  if (!p) return ''
  if (Array.isArray(p.categories) && p.categories.length > 0) {
    const c = p.categories[0]
    return props.isRtl ? (c.name_ar || c.name_en || '') : (c.name_en || c.name_ar || '')
  }
  if (p.category && typeof p.category === 'object') {
    return props.isRtl
      ? (p.category.name_ar || p.category.name_en || '')
      : (p.category.name_en || p.category.name_ar || '')
  }
  return ''
}

const postTags = (p) => {
  if (!p) return []
  return Array.isArray(p.tags) ? p.tags : []
}

const readTime = (p) => {
  if (!p) return 5
  const content = p.content_ar || p.content_en || ''
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(props.isRtl ? 'ar-SA' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

const formatViews = (v) =>
  new Intl.NumberFormat(props.isRtl ? 'ar-SA' : 'en-US').format(Number(v) || 0)

const getCatCount = (catId) =>
  allPosts.value.filter(p =>
    Array.isArray(p.categories)
      ? p.categories.some(c => c.id === catId)
      : p.category?.id === catId
  ).length

const catIconMap = { marketing: '', brand: '', seo: '', linkedin: '', tips: '' }
const getCatIcon = (cat) => {
  const slug = (cat.slug || cat.name_en || '').toLowerCase()
  for (const [key, icon] of Object.entries(catIconMap)) {
    if (slug.includes(key)) return icon
  }
  return ''
}

// ── API ───────────────────────────────────────
const fetchPosts = async (p = 1) => {
  try {
    const params = { page: p, per_page: 12, status: 'published' }
    if (activeFilter.value !== 'all') params.category_id = activeFilter.value
    const { data } = await publicAxios.get('/blog', { params })
    const posts = data.data || data || []
    if (p === 1) {
      allPosts.value = posts
    } else {
      allPosts.value = [...allPosts.value, ...posts]
    }
    lastPage.value = data.last_page || 1
    page.value = p
  } catch (err) {
    console.error('fetchPosts error:', err)
  }
}

const fetchCategories = async () => {
  try {
    const { data } = await publicAxios.get('/blog/categories')
    apiCategories.value = data.data || data || []
  } catch (err) {
    console.error('fetchCategories error:', err)
  }
}

const setFilter = async (key) => {
  activeFilter.value = key
  loading.value = true
  allPosts.value = []
  await fetchPosts(1)
  loading.value = false
}

const loadMore = async () => {
  if (!hasMore.value || loadingMore.value) return
  loadingMore.value = true
  await fetchPosts(page.value + 1)
  loadingMore.value = false
}

// ── Modal ─────────────────────────────────────
// دالة واحدة فقط تجمع فتح المودل + جلب التعليقات
const openPost = (p) => {
  selectedPost.value = p
  document.body.style.overflow = 'hidden'
  commentForm.value   = { name: '', email: '', comment: '', parent_id: null }
  commentErrors.value = {}
  commentSuccess.value = false
  replyingTo.value    = null
  fetchComments(p.id)
}

const closePost = () => {
  selectedPost.value = null
  document.body.style.overflow = ''
}

// ── Newsletter ────────────────────────────────
const subscribeNewsletter = () => {
  if (!nlEmail.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nlEmail.value)) return
  nlSubscribed.value = true
  setTimeout(() => { nlSubscribed.value = false; nlEmail.value = '' }, 4000)
}

// ── Comments ──────────────────────────────────
const fetchComments = async (postId) => {
  commentsLoading.value = true
  comments.value = []
  try {
    const { data } = await publicAxios.get(`/blog/${postId}/comments`)
    comments.value = data.data || []
  } catch (e) {
    console.error('fetchComments error:', e)
  } finally {
    commentsLoading.value = false
  }
}

const setReply = (comment) => {
  replyingTo.value = { id: comment.id, name: comment.name }
  commentForm.value.parent_id = comment.id
}

const cancelReply = () => {
  replyingTo.value = null
  commentForm.value.parent_id = null
}

const validateComment = () => {
  const e = {}
  if (!commentForm.value.name.trim())    e.name    = props.isRtl ? 'الاسم مطلوب'        : 'Name is required'
  if (!commentForm.value.email.trim())   e.email   = props.isRtl ? 'البريد مطلوب'       : 'Email is required'
  if (!commentForm.value.comment.trim()) e.comment = props.isRtl ? 'التعليق مطلوب'      : 'Comment is required'
  commentErrors.value = e
  return !Object.keys(e).length
}

const submitComment = async () => {
  if (!validateComment()) return
  submittingComment.value = true
  try {
    await publicAxios.post(`/blog/${selectedPost.value.id}/comments`, commentForm.value)

    // ── احفظ الاسم والإيميل للمرة القادمة ──
    localStorage.setItem('commenter_name',  commentForm.value.name)
    localStorage.setItem('commenter_email', commentForm.value.email)

    commentSuccess.value = true
    commentForm.value = {
      name:      commentForm.value.name,
      email:     commentForm.value.email,
      comment:   '',
      parent_id: null,
    }
    replyingTo.value = null
  } catch (err) {
    const serverErrors = err.response?.data?.errors
    if (serverErrors) {
      commentErrors.value = Object.fromEntries(
        Object.entries(serverErrors).map(([k, v]) => [k, v[0]])
      )
    }
  } finally {
    submittingComment.value = false
  }
}

// ── Init ──────────────────────────────────────
onMounted(async () => {
  await Promise.all([fetchPosts(1), fetchCategories()])
  loading.value = false
})
</script>

<style scoped>
/* ══ Brand Tokens ════════════════════════════ */
.blog-section {
  --blue:      #162FBB;
  --blue-dk:   #0e1a6e;
  --blue-lt:   #2a4be7;
  --blue-xs:   rgba(22,47,187,.06);
  --gold:      #E7AE18;
  --gold-lt:   #f5c842;
  --bg:        #F0F0F0;
  --neu:       #D0D6E5;
  --white:     #ffffff;
  --gray-50:   #F8F9FA;
  --gray-100:  #F1F3F5;
  --gray-200:  #E9ECEF;
  --gray-600:  #6C757D;
  --gray-700:  #495057;
  --gray-800:  #343A40;
  --t-base:    0.3s ease;
  --t-spring:  0.45s cubic-bezier(0.34, 1.3, 0.64, 1);
  --r-sm:  8px;
  --r-md:  12px;
  --r-lg:  16px;
  --r-xl:  20px;
  --r-2xl: 26px;
  --shadow-sm: 0 2px 8px rgba(22,47,187,.06);
  --shadow-md: 0 8px 28px rgba(22,47,187,.1);
  --shadow-lg: 0 20px 56px rgba(22,47,187,.14);
}

/* ══ Section ═════════════════════════════════ */
.blog-section {
  padding: 7rem 0 5rem;
  background: linear-gradient(165deg, #F8F9FA 0%, #fff 55%, #F0F4FF 100%);
  position: relative;
  overflow-x: hidden;
}

/* ══ Decoration ══════════════════════════════ */
.bg-deco { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.deco-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: .3; }
.orb-1 {
  width: 500px; height: 500px; top: -180px; left: -120px;
  background: radial-gradient(circle, rgba(22,47,187,.22), transparent 70%);
  animation: orb-float 24s ease-in-out infinite;
}
.orb-2 {
  width: 400px; height: 400px; bottom: -120px; right: -100px;
  background: radial-gradient(circle, rgba(231,174,24,.22), transparent 70%);
  animation: orb-float 30s ease-in-out infinite reverse;
}
.orb-3 {
  width: 260px; height: 260px; top: 40%; left: 50%;
  background: radial-gradient(circle, rgba(22,47,187,.1), transparent 70%);
  animation: orb-float 18s ease-in-out infinite 4s;
}
@keyframes orb-float {
  0%, 100% { transform: translate(0, 0) }
  33%       { transform: translate(30px, -30px) }
  66%       { transform: translate(-22px, 22px) }
}
.deco-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(22,47,187,.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(22,47,187,.022) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ══ Container ═══════════════════════════════ */
.container {
  max-width: 1260px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

/* ══ Header ══════════════════════════════════ */
.sec-header { text-align: center; margin-bottom: 3rem; }
.sec-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(22,47,187,.07); border: 1px solid rgba(22,47,187,.15);
  color: var(--blue); padding: 5px 18px; border-radius: 50px;
  font-size: .78rem; font-weight: 700; margin-bottom: 1.1rem; letter-spacing: .05em;
  text-transform: uppercase;
}
.badge-dot {
  width: 7px; height: 7px;
  background: var(--gold); border-radius: 50%;
  animation: pdot 2s ease-in-out infinite;
}
@keyframes pdot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(231,174,24,.6) }
  50%       { box-shadow: 0 0 0 5px rgba(231,174,24,0) }
}
.sec-title {
  font-size: clamp(2rem, 4vw, 3.1rem);
  font-weight: 800; color: var(--blue-dk);
  margin-bottom: 1rem; line-height: 1.15; letter-spacing: -.025em;
}
.title-highlight {
  color: var(--blue); position: relative; display: inline-block;
}
.title-highlight::after {
  content: ''; position: absolute; bottom: -6px; left: 0; right: 0;
  height: 3px; background: linear-gradient(90deg, var(--gold), transparent); border-radius: 3px;
}
.sec-sub { font-size: 1rem; color: var(--gray-600); max-width: 580px; margin: 0 auto; line-height: 1.75; }

/* ══ Filter ══════════════════════════════════ */
.filter-wrap { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin-bottom: 3rem; }
.filter-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 18px; background: var(--white); border: 1.5px solid var(--gray-200);
  border-radius: 50px; cursor: pointer; font-family: inherit;
  font-size: .84rem; font-weight: 700; color: var(--gray-700);
  transition: all var(--t-base); white-space: nowrap;
}
.filter-btn:hover { border-color: var(--blue); color: var(--blue); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(22,47,187,.12); }
.filter-btn.active { background: var(--blue); border-color: var(--blue); color: #fff; box-shadow: 0 6px 22px rgba(22,47,187,.3); }
.btn-icon { font-size: .88rem; }
.btn-label { line-height: 1; }
.btn-count {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 22px; height: 22px; padding: 0 5px;
  border-radius: 50px; font-size: .65rem; font-weight: 800;
  background: rgba(22,47,187,.1); color: var(--blue);
}
.filter-btn.active .btn-count { background: rgba(255,255,255,.22); color: #fff; }

/* ══ Skeleton ════════════════════════════════ */
.skeleton-wrap { margin-bottom: 2rem; }
.skeleton-featured { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; margin-bottom: 20px; }
.skel-body { display: flex; flex-direction: column; gap: 12px; padding: 20px; }
.skeleton-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.skel-card { background: #fff; border-radius: var(--r-2xl); overflow: hidden; padding: 0 0 16px; }
.skel {
  border-radius: 8px;
  background: linear-gradient(90deg, #e8edf5 25%, #f4f7fb 50%, #e8edf5 75%);
  background-size: 200% 100%; animation: shimmer 1.5s infinite;
}
@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
.skel-img-big { height: 280px; border-radius: var(--r-2xl) var(--r-2xl) 0 0; }
.skel-img     { height: 180px; border-radius: 0; margin-bottom: 0; }
.skel-badge   { height: 20px; width: 80px; border-radius: 20px; margin: 12px 16px 0; }
.skel-title-lg{ height: 28px; width: 85%; }
.skel-title   { height: 20px; width: 80%; margin: 0 16px; }
.skel-line    { height: 14px; width: 100%; }
.skel-line.short { width: 65%; }

/* ══ Blog Layout ═════════════════════════════ */
.blog-layout { display: grid; grid-template-columns: 1.6fr 1fr; gap: 22px; margin-bottom: 26px; align-items: start; }

/* ══ Shared Image Rules ══════════════════════ */
.feat-img-box, .side-img-box, .card-img-box, .m-img-box { position: relative; overflow: hidden; flex-shrink: 0; }
.feat-img, .side-img, .card-img, .m-img {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  object-fit: cover; object-position: center; transition: transform var(--t-spring); display: block;
}

/* ══ Category Tag ════════════════════════════ */
.p-cat-tag {
  position: absolute; top: 12px; inset-inline-start: 12px; z-index: 3;
  background: rgba(255,255,255,.96); color: var(--blue);
  font-size: .65rem; font-weight: 800; padding: 3px 11px; border-radius: 50px;
  box-shadow: 0 2px 8px rgba(0,0,0,.12); white-space: nowrap; line-height: 1.6; letter-spacing: .02em;
}
.p-cat-tag.sm { font-size: .6rem; padding: 2px 8px; }

/* ══ Featured Post ═══════════════════════════ */
.post-featured {
  background: var(--white); border-radius: var(--r-2xl); overflow: hidden; cursor: pointer;
  box-shadow: var(--shadow-sm); transition: transform var(--t-spring), box-shadow var(--t-spring);
  display: flex; flex-direction: column;
}
.post-featured:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); }
.post-featured:hover .feat-img { transform: scale(1.06); }
.feat-img-box { height: 300px; }
.feat-overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(to bottom, transparent 35%, rgba(10,16,60,.55) 100%); }
.feat-badge {
  position: absolute; top: 12px; inset-inline-end: 12px; z-index: 3;
  display: inline-flex; align-items: center; gap: 5px;
  background: var(--gold); color: var(--blue-dk); font-size: .65rem; font-weight: 800;
  padding: 4px 12px; border-radius: 50px; box-shadow: 0 4px 12px rgba(231,174,24,.4);
}
.feat-read-time {
  position: absolute; bottom: 12px; inset-inline-end: 12px; z-index: 3;
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(0,0,0,.45); backdrop-filter: blur(6px);
  color: rgba(255,255,255,.9); font-size: .65rem; font-weight: 600; padding: 3px 9px; border-radius: 20px;
}

/* ══ Side Posts ══════════════════════════════ */
.side-col { display: flex; flex-direction: column; gap: 14px; }
.post-side {
  display: flex; background: var(--white); border-radius: var(--r-xl);
  overflow: hidden; cursor: pointer; box-shadow: var(--shadow-sm);
  transition: transform var(--t-spring), box-shadow var(--t-base);
}
.post-side:hover { transform: translateX(-5px); box-shadow: var(--shadow-md); }
.rtl-blog .post-side:hover { transform: translateX(5px); }
.post-side:hover .side-img { transform: scale(1.08); }
.side-img-box { width: 118px; min-width: 118px; position: relative; }
.side-img-box::before { content: ''; display: block; padding-top: 100%; }
.side-overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(135deg, rgba(22,47,187,.18), transparent); }
.side-body { padding: .85rem 1rem; display: flex; flex-direction: column; gap: .35rem; flex: 1; overflow: hidden; }
.side-title { font-size: .88rem; font-weight: 800; color: var(--gray-800); line-height: 1.35; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.side-exc { font-size: .74rem; color: var(--gray-600); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.side-foot { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 5px; }
.side-arr { color: var(--blue); opacity: 0; transition: opacity var(--t-base), transform var(--t-base); display: flex; }
.post-side:hover .side-arr { opacity: 1; transform: translateX(-4px); }
.rtl-blog .post-side:hover .side-arr { transform: translateX(4px) rotate(180deg); }

/* ══ Posts Grid ══════════════════════════════ */
.posts-grid { margin-bottom: 2rem; }
.grid-inner { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.post-card {
  background: var(--white); border-radius: var(--r-2xl); overflow: hidden; cursor: pointer;
  box-shadow: var(--shadow-sm); transition: transform var(--t-spring), box-shadow var(--t-spring);
  display: flex; flex-direction: column; border: 1px solid rgba(22,47,187,.04);
}
.post-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); }
.post-card:hover .card-img { transform: scale(1.07); }
.card-img-box { position: relative; overflow: hidden; padding-bottom: 60%; }
.card-overlay {
  position: absolute; inset: 0; z-index: 2;
  background: rgba(14,26,96,.54); backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity var(--t-base);
}
.post-card:hover .card-overlay { opacity: 1; }
.c-read-lbl {
  display: flex; align-items: center; gap: 7px;
  color: #fff; font-size: .78rem; font-weight: 700; padding: 7px 20px;
  border: 1.5px solid rgba(255,255,255,.7); border-radius: 50px;
  transform: translateY(10px); transition: transform .32s cubic-bezier(.34, 1.56, .64, 1);
}
.post-card:hover .c-read-lbl { transform: translateY(0); }
.card-read-time {
  position: absolute; bottom: 10px; inset-inline-end: 10px; z-index: 3;
  background: rgba(0,0,0,.42); backdrop-filter: blur(4px);
  color: rgba(255,255,255,.88); font-size: .62rem; font-weight: 600; padding: 2px 8px; border-radius: 20px;
}

/* ══ Shared Post Body ════════════════════════ */
.p-body { padding: 1.1rem 1.2rem; display: flex; flex-direction: column; gap: .55rem; flex: 1; }
.p-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.p-cat { font-size: .64rem; font-weight: 800; color: var(--blue); background: rgba(22,47,187,.08); padding: 2px 10px; border-radius: 50px; white-space: nowrap; letter-spacing: .02em; }
.p-sep  { color: var(--neu); font-size: .72rem; }
.p-info { display: inline-flex; align-items: center; gap: 3px; font-size: .68rem; color: var(--gray-600); white-space: nowrap; }
.p-title { font-size: .96rem; font-weight: 800; color: var(--gray-800); line-height: 1.38; margin: 0; }
.feat-title { font-size: 1.25rem; }
.p-excerpt { font-size: .83rem; color: var(--gray-600); line-height: 1.72; margin: 0; flex: 1; }
.clamp2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.p-footer { display: flex; align-items: center; justify-content: space-between; padding-top: .7rem; border-top: 1px solid var(--gray-200); flex-wrap: wrap; gap: 6px; margin-top: auto; }
.p-author { display: flex; align-items: center; gap: 9px; }
.p-avatar {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, var(--blue), var(--blue-lt));
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: var(--gold); font-size: .78rem; font-weight: 800; flex-shrink: 0;
}
.p-avatar.large { width: 42px; height: 42px; font-size: .95rem; }
.p-aname { display: block; font-size: .74rem; font-weight: 700; color: var(--gray-800); line-height: 1.2; }
.p-arole { display: block; font-size: .62rem; color: var(--gray-600); }
.p-readbtn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 7px 16px; background: var(--blue); color: #fff; border: none;
  border-radius: var(--r-sm); font-size: .77rem; font-weight: 700; cursor: pointer;
  transition: all var(--t-base); font-family: inherit; white-space: nowrap;
}
.p-readbtn:hover { background: var(--gold); color: var(--blue-dk); }
.p-readbtn svg, .p-link svg { transition: transform .22s; flex-shrink: 0; }
.p-readbtn:hover svg { transform: translateX(4px); }
.rtl-blog .p-readbtn svg { transform: rotate(180deg); }
.rtl-blog .p-readbtn:hover svg { transform: rotate(180deg) translateX(4px); }
.p-link {
  display: inline-flex; align-items: center; gap: 5px;
  background: transparent; border: none; color: var(--blue); font-size: .73rem; font-weight: 700;
  cursor: pointer; font-family: inherit; padding: 0; white-space: nowrap; transition: gap .2s;
}
.p-link:hover { gap: 9px; }
.p-link:hover svg { transform: translateX(3px); }
.rtl-blog .p-link svg { transform: rotate(180deg); }
.rtl-blog .p-link:hover svg { transform: rotate(180deg) translateX(3px); }
.p-meta-foot { display: flex; gap: 10px; flex-wrap: wrap; }
.p-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.tag { font-size: .62rem; font-weight: 600; color: var(--gray-600); background: var(--gray-100); padding: 2px 8px; border-radius: 4px; transition: all .2s; white-space: nowrap; }
.tag:hover { background: var(--blue); color: #fff; }

/* ══ Card Animation ══════════════════════════ */
.card-pop-enter-active { transition: opacity .45s ease var(--delay, 0ms), transform .5s cubic-bezier(.34, 1.2, .64, 1) var(--delay, 0ms); }
.card-pop-leave-active { transition: opacity .2s ease, transform .2s ease; position: absolute; }
.card-pop-enter-from   { opacity: 0; transform: translateY(28px) scale(.95); }
.card-pop-leave-to     { opacity: 0; transform: scale(.92); }
.card-pop-move         { transition: transform .5s cubic-bezier(.34, 1.2, .64, 1); }

/* ══ Empty State ═════════════════════════════ */
.empty-state { text-align: center; padding: 5rem 2rem; background: var(--white); border-radius: var(--r-2xl); border: 1.5px dashed var(--neu); margin-bottom: 2rem; }
.empty-icon-wrap { width: 80px; height: 80px; background: var(--gray-100); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.2rem; color: var(--neu); }
.empty-state h3 { font-size: 1.15rem; color: var(--gray-700); margin: 0 0 .5rem; font-weight: 700; }
.empty-state p  { font-size: .88rem; color: var(--gray-600); }

/* ══ Load More ═══════════════════════════════ */
.load-wrap { text-align: center; margin-bottom: 3rem; }
.load-btn {
  display: inline-flex; align-items: center; gap: 9px; padding: .8rem 2.4rem;
  background: transparent; border: 1.5px solid var(--neu); color: var(--blue); border-radius: 50px;
  font-size: .87rem; font-weight: 700; cursor: pointer; transition: all var(--t-base); font-family: inherit;
}
.load-btn:hover:not(:disabled) { background: var(--blue); color: #fff; border-color: var(--blue); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(22,47,187,.22); }
.load-btn:disabled { opacity: .6; cursor: not-allowed; }
.spin-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(22,47,187,.25); border-top-color: var(--blue); border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ══ Newsletter ══════════════════════════════ */
.newsletter-card {
  background: linear-gradient(135deg, var(--blue-dk) 0%, var(--blue) 60%, #1e3fd4 100%);
  border-radius: var(--r-2xl); padding: 2.4rem 2.8rem;
  display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;
  position: relative; overflow: hidden; box-shadow: 0 16px 48px rgba(22,47,187,.28);
}
.nl-dots { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,.07) 1.5px, transparent 1.5px); background-size: 28px 28px; pointer-events: none; }
.nl-glow { position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, rgba(231,174,24,.2), transparent 70%); pointer-events: none; }
.nl-icon { width: 56px; height: 56px; background: rgba(231,174,24,.18); border-radius: var(--r-lg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; z-index: 1; box-shadow: 0 0 0 8px rgba(231,174,24,.08); }
.nl-text { flex: 1; position: relative; z-index: 1; min-width: 180px; }
.nl-text h4 { font-size: 1.08rem; font-weight: 800; color: #fff; margin-bottom: 5px; }
.nl-text p  { font-size: .82rem; color: rgba(255,255,255,.68); }
.nl-form { display: flex; gap: 10px; position: relative; z-index: 1; }
.nl-form input { padding: .7rem 1.2rem; background: rgba(255,255,255,.1); border: 1.5px solid rgba(255,255,255,.2); color: #fff; border-radius: var(--r-md); font-size: .85rem; font-family: inherit; outline: none; transition: all .22s; min-width: 230px; }
.nl-form input::placeholder { color: rgba(255,255,255,.42); }
.nl-form input:focus { border-color: var(--gold); background: rgba(255,255,255,.18); }
.nl-form button { padding: .7rem 1.6rem; background: var(--gold); color: var(--blue-dk); border: none; border-radius: var(--r-md); font-size: .88rem; font-weight: 800; cursor: pointer; transition: all var(--t-spring); font-family: inherit; white-space: nowrap; min-width: 94px; display: flex; align-items: center; justify-content: center; }
.nl-form button:hover:not(.done) { background: #fff; transform: translateY(-2px); box-shadow: 0 8px 22px rgba(0,0,0,.18); }
.nl-form button.done { background: rgba(16,185,129,.9); color: #fff; }

/* ══ Modal ═══════════════════════════════════ */
.modal-overlay { position: fixed; inset: 0; background: rgba(8,14,48,.78); backdrop-filter: blur(12px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1.2rem; }
.modal-box { background: var(--white); border-radius: var(--r-2xl); width: 100%; max-width: 680px; overflow: hidden; position: relative; max-height: 90vh; overflow-y: auto; box-shadow: 0 36px 90px rgba(0,0,0,.26); }
.modal-box::-webkit-scrollbar { width: 5px; }
.modal-box::-webkit-scrollbar-track { background: var(--gray-100); }
.modal-box::-webkit-scrollbar-thumb { background: var(--blue); border-radius: 3px; }
.m-close { position: absolute; top: 14px; inset-inline-end: 14px; width: 34px; height: 34px; background: rgba(255,255,255,.95); border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 3px 12px rgba(0,0,0,.16); transition: all var(--t-base); }
.m-close:hover { transform: rotate(90deg); background: var(--blue); color: #fff; }
.m-img-box { height: 270px; position: relative; }
.m-img { transition: none !important; }
.m-img-ov { position: absolute; inset: 0; z-index: 1; background: linear-gradient(to bottom, transparent 30%, rgba(8,14,48,.55) 100%); }
.m-img-meta { position: absolute; bottom: 14px; z-index: 3; inset-inline-start: 16px; inset-inline-end: 16px; display: flex; justify-content: space-between; align-items: center; }
.m-cat-tag { background: rgba(255,255,255,.96); color: var(--blue); font-size: .7rem; font-weight: 800; padding: 4px 12px; border-radius: 50px; box-shadow: 0 2px 8px rgba(0,0,0,.12); }
.m-read-time { display: inline-flex; align-items: center; gap: 5px; background: rgba(0,0,0,.4); backdrop-filter: blur(6px); color: rgba(255,255,255,.88); font-size: .65rem; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
.m-body { padding: 1.8rem 2rem; }
.m-meta-row { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; margin-bottom: .9rem; }
.m-title { font-size: 1.55rem; font-weight: 800; color: var(--gray-800); margin-bottom: .85rem; line-height: 1.28; }
.m-excerpt { font-size: .92rem; color: var(--gray-700); line-height: 1.78; margin-bottom: 1rem; }
.m-divider { height: 2px; background: linear-gradient(90deg, var(--blue), var(--gold), transparent); border-radius: 2px; margin-bottom: 1.1rem; }
.m-content { font-size: .88rem; color: var(--gray-600); line-height: 1.88; margin-bottom: 1.2rem; padding: 1rem 1.2rem; background: linear-gradient(135deg, var(--gray-100), #fff); border-radius: var(--r-md); border-inline-start: 3px solid var(--blue); }
.m-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 1.3rem; }
.m-author-row { display: flex; align-items: center; gap: 10px; margin-bottom: 1.3rem; padding: .9rem 1rem; background: var(--gray-50); border-radius: var(--r-md); border: 1px solid var(--gray-200); }
.m-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 1rem; }
.m-cta { display: inline-flex; align-items: center; gap: 7px; padding: .78rem 1.6rem; background: var(--blue); color: #fff; border: none; border-radius: var(--r-md); font-size: .9rem; font-weight: 700; cursor: pointer; transition: all var(--t-base); font-family: inherit; }
.m-cta:hover { background: var(--gold); color: var(--blue-dk); }
.m-cta svg { transition: transform .2s; flex-shrink: 0; }
.m-cta:hover svg { transform: translateX(4px); }
.rtl-blog .m-cta svg, .rtl-modal .m-cta svg { transform: rotate(180deg); }
.rtl-blog .m-cta:hover svg, .rtl-modal .m-cta:hover svg { transform: rotate(180deg) translateX(4px); }
.m-cls-btn { display: inline-flex; align-items: center; padding: .78rem 1.6rem; background: transparent; border: 1.5px solid var(--neu); color: var(--gray-700); border-radius: var(--r-md); font-size: .9rem; font-weight: 700; cursor: pointer; transition: all .2s; font-family: inherit; }
.m-cls-btn:hover { border-color: var(--blue); color: var(--blue); }

/* ══ Modal Transition ════════════════════════ */
.modal-pop-enter-active { transition: all .4s cubic-bezier(.34, 1.2, .64, 1); }
.modal-pop-leave-active { transition: all .25s ease; }
.modal-pop-enter-from, .modal-pop-leave-to { opacity: 0; }
.modal-pop-enter-from .modal-box { transform: scale(.9) translateY(32px); }
.modal-pop-leave-to   .modal-box { transform: scale(.96) translateY(14px); }

/* ══ RTL ═════════════════════════════════════ */
.rtl-blog { direction: rtl; }

/* ══ Comments ════════════════════════════════ */
.comments-section { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid var(--gray-100); }
.comments-header { margin-bottom: 1.1rem; }
.comments-title { display: flex; align-items: center; gap: 8px; font-size: 1rem; font-weight: 800; color: var(--gray-800); margin: 0; }
.comments-count { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: var(--blue); color: #fff; font-size: .65rem; font-weight: 800; }
.comments-loading { display: flex; justify-content: center; padding: 1.5rem; }
.no-comments { text-align: center; padding: 1.5rem; background: var(--gray-50); border-radius: var(--r-md); font-size: .85rem; color: var(--gray-600); border: 1.5px dashed var(--neu); margin-bottom: 1.2rem; }
.comments-list { display: flex; flex-direction: column; gap: .9rem; margin-bottom: 1.4rem; }
.comment-item { display: flex; gap: .75rem; align-items: flex-start; }
.comment-avatar { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, var(--blue), var(--blue-lt)); display: flex; align-items: center; justify-content: center; color: var(--gold); font-size: .82rem; font-weight: 800; }
.reply-avatar { width: 28px; height: 28px; font-size: .7rem; }
.comment-body { flex: 1; }
.comment-meta { display: flex; align-items: center; gap: 8px; margin-bottom: .3rem; }
.comment-name { font-size: .82rem; font-weight: 700; color: var(--gray-800); }
.comment-date { font-size: .7rem; color: var(--gray-600); }
.comment-text { font-size: .83rem; color: var(--gray-700); line-height: 1.65; margin: 0 0 .4rem; }
.reply-trigger { display: inline-flex; align-items: center; gap: 4px; background: none; border: none; cursor: pointer; font-size: .72rem; font-weight: 700; color: var(--blue); padding: 0; font-family: inherit; transition: opacity .2s; }
.reply-trigger:hover { opacity: .7; }
.replies-list { margin-top: .6rem; padding-inline-start: 1rem; border-inline-start: 2px solid rgba(22,47,187,.15); display: flex; flex-direction: column; gap: .65rem; }
.reply-item { display: flex; gap: .6rem; align-items: flex-start; }
.comment-success { display: flex; align-items: center; gap: 8px; padding: .9rem 1.1rem; border-radius: var(--r-md); background: #dcfce7; color: #15803d; font-size: .85rem; font-weight: 600; margin-bottom: 1rem; }
.comment-form { background: var(--gray-50); border-radius: var(--r-lg); padding: 1.1rem; border: 1px solid var(--gray-200); }
.form-title { font-size: .88rem; font-weight: 700; color: var(--gray-800); margin: 0 0 .85rem; }
.reply-banner { display: flex; align-items: center; justify-content: space-between; background: rgba(22,47,187,.07); border-radius: var(--r-sm); padding: .45rem .75rem; margin-bottom: .75rem; font-size: .78rem; font-weight: 600; color: var(--blue); }
.reply-banner button { background: none; border: none; cursor: pointer; color: var(--blue); display: flex; padding: 2px; }
.cf-row { display: grid; grid-template-columns: 1fr 1fr; gap: .65rem; margin-bottom: .65rem; }
.cf-field { display: flex; flex-direction: column; gap: .25rem; margin-bottom: .65rem; }
.cf-field:last-child { margin-bottom: 0; }
.cf-row .cf-field { margin-bottom: 0; }
.cf-field input, .cf-field textarea { padding: .6rem .85rem; border: 1.5px solid var(--gray-200); border-radius: var(--r-sm); font-size: .82rem; background: #fff; outline: none; transition: border .2s; font-family: inherit; resize: vertical; }
.cf-field input:focus, .cf-field textarea:focus { border-color: var(--blue); }
.cf-field input.cf-error, .cf-field textarea.cf-error { border-color: #ef4444; }
.cf-err-msg { font-size: .7rem; color: #ef4444; }
.cf-submit { display: inline-flex; align-items: center; gap: 7px; padding: .65rem 1.4rem; background: linear-gradient(135deg, var(--blue), var(--blue-dk)); color: #fff; border: none; border-radius: var(--r-md); font-size: .82rem; font-weight: 700; cursor: pointer; transition: all var(--t-base); font-family: inherit; margin-top: .65rem; }
.cf-submit:hover:not(:disabled) { box-shadow: 0 6px 20px rgba(22,47,187,.35); transform: translateY(-1px); }
.cf-submit:disabled { opacity: .7; cursor: not-allowed; }

.commenter-greeting {
  display: flex; align-items: center; gap: 10px;
  background: rgba(22,47,187,.06); border: 1px solid rgba(22,47,187,.12);
  border-radius: var(--r-md); padding: .65rem .9rem; margin-bottom: .85rem;
}
.cg-avatar {
  width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, var(--blue), var(--blue-lt));
  display: flex; align-items: center; justify-content: center;
  color: var(--gold); font-size: .82rem; font-weight: 800;
}
.cg-info { display: flex; flex-direction: column; gap: 2px; }
.cg-name { font-size: .83rem; font-weight: 700; color: var(--gray-800); }
.cg-change {
  background: none; border: none; cursor: pointer; font-size: .7rem;
  color: var(--blue); font-family: inherit; padding: 0; text-decoration: underline;
  text-align: start;
}
/* ══ Responsive ══════════════════════════════ */
@media (max-width: 1100px) {
  .blog-layout { grid-template-columns: 1fr; }
  .feat-img-box { height: 260px; }
  .grid-inner { grid-template-columns: repeat(2, 1fr); }
  .skeleton-featured { grid-template-columns: 1fr; }
  .skeleton-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .blog-section { padding: 4.5rem 0 3rem; }
  .container { padding: 0 1.2rem; }
  .grid-inner { grid-template-columns: 1fr; }
  .skeleton-grid { grid-template-columns: 1fr; }
  .post-side { flex-direction: column; }
  .side-img-box { width: 100%; }
  .side-img-box::before { padding-top: 52%; }
  .newsletter-card { flex-direction: column; padding: 1.7rem; text-align: center; }
  .nl-form { width: 100%; flex-direction: column; }
  .nl-form input { min-width: unset; }
  .filter-btn { padding: 6px 13px; font-size: .76rem; }
  .m-body { padding: 1.2rem 1.3rem; }
  .m-title { font-size: 1.25rem; }
  .cf-row { grid-template-columns: 1fr; }
}
</style>
