<template>
    <section class="song-section">
        <header>
            <button class="play-button-playlist"><i class="fa fa-play"></i></button>
            <button><i class="far fa-heart"></i></button>
            <button><i class="fas fa-ellipsis"></i></button>
        </header>

        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Album</th>
                    <th>Date added</th>
                    <th><i class="far fa-clock"></i></th>
                </tr>
            </thead>
            <tbody>
                <SongCard />
                <SongCard />
                <SongCard />
                <SongCard />
                <SongCard />
                <SongCard />
                <SongCard />
                <SongCard />

            </tbody>
        </table>
        <SpotifyFooter />
    </section>
</template>

<script>
    import SongCard from './SongCard.vue';
    import SpotifyFooter from '@/components/SpotifyFooter.vue'

    export default{
        components:{
            SongCard,
            SpotifyFooter
        }
    }

</script>