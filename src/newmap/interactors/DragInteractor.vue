<script setup lang="ts">
    import { inject } from 'vue';
    import { defaultState, mapStateKey } from '../state';
    import { usePointerDrag } from './usePointerDrag';
    import Vector2 from '@/util/Vector2';

    const { target, panPixels } = inject(mapStateKey, defaultState())

    usePointerDrag((state) => {
        const t = state.length
        for (const pointer of state)
            panPixels(new Vector2(-pointer.moveX / t, -pointer.moveY / t))
    }, { target })
</script>