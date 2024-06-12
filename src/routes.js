export default [
    {
        name: 'Home',
        path: '/',
        component: require('@/pages/HomePage').default,
    },
    {
        name: 'Basic',
        path: '/basic',
        component: require('@/pages/BasicPage').default,
    },
    {
        name: 'raids',
        path: '/raids',
        component: require('@/pages/RaidsPage').default,
    },
    {
        name: 'ranking',
        path: '/ranking',
        component: require('@/pages/RankingPage').default,
    },
    {
        name: 'Coin',
        path: '/Coin',
        component: require('@/pages/CoinPage').default,
    },
    {
        name: 'Profiles',
        path: '/Profiles',
        component: require('@/pages/ProfilePage.vue').default,
    },
    {
        name: 'Details',
        path: '/Details',
        component: require('@/pages/DetailsPage.vue').default,
    },
    {
        name: 'UserDetails',
        path: '/UserDetails',
        component: require('@/pages/UserDetails.vue').default,
    }
]