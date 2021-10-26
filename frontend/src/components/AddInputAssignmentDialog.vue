<!-- Contains a fab button that reveals the input assignment dialog -->

<template>
	<span>
		<v-slide-y-reverse-transition>
			<v-card v-show="value" ref="card" style="position: absolute;" :style="style">
				<div v-dragged="drag" id="drag-area" class="pa-1">
					<v-spacer />
					<v-btn
						icon
						small
						@click="$emit('input', false)"
					>
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</div>
				<InputAssignment
					:width="400"
				/>
			</v-card>
		</v-slide-y-reverse-transition>

		<v-btn 
			ref="button"
			fab
			color="primary"
			absolute
			bottom
			right
			class="mr-1 mb-1"
			style="bottom: 16px;"
			@click="$emit('input', true)"
		>
			<v-icon>mdi-plus</v-icon>
		</v-btn>
	</span>
</template>

<style scoped>
	#drag-area {
		background-color: #eee;
		display: flex;
		cursor: move;
	}
</style>

<script>
import InputAssignment from '@/components/InputAssignment'

export default {
	name: 'AddInputAssignmentDialog',

	emits: ['input'],

	props: {
		value: { type: Boolean, required: true }, // whether to show dialog
	},

	components: {
		InputAssignment,
	},

	mounted() {
		this.resetPos()
	},

	watch: {
		value: {
			immediate: true,
			handler() {
				if (!this.value) {
					this.resetPos()
				}
			},
		}
	},

	data() {
		return {
			x: 0,
			y: 0,
		}
	},

	computed: {
		style() {
			// Style the position of the card
			return {
				top: `${this.y}px`,
				left: `${this.x}px`,
			}
		}
	},

	methods: {
		drag({ deltaX, deltaY }) {
			// Move dialog box when dragged
			const { clientHeight, clientWidth } = this.$refs.card.$el

			// Keep dialog box in bounds of window
			if (deltaX) {
				if (this.x + deltaX + clientWidth > window.innerWidth) 
					this.x = window.innerWidth - clientWidth
				else if (this.x + deltaX < 0)
					this.x = 0
				else
					this.x += deltaX
			}
			if (deltaY) {
				if (this.y + deltaY + clientHeight > window.innerHeight) 
					this.y = window.innerHeight - clientHeight
				else if (this.y + deltaY < 0)
					this.y = 0
				else
					this.y += deltaY
			} 
		},
		resetPos() {
			/* 
			 * Resets the position of dialog to be above fab
			 */
			const card = this.$refs.card.$el
			const button = this.$refs.button.$el

			const { clientHeight: btnHeight, clientWidth: btnWidth } = button

			// Show card temporarily to get width and height
			card.style.display = 'unset'
			const { clientHeight: cardHeight, clientWidth: cardWidth } = card
			card.style.display = 'none'

			// Set position
			this.x = window.innerWidth - cardWidth - 16
			this.y = window.innerHeight - cardHeight - btnHeight - 2*16 // 16 is the margin surrounding the button 
		}
	},
}
</script>