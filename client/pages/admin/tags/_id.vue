<template>
  <v-container>
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-card>
        <v-card-title>
          <span>Sửa Tag</span>
          <v-spacer />
          <v-btn
            :disbaled="!valid"
            color="primary"
            @click="save"
          >
            Lưu thay đổi
            <v-icon right>
              mdi-content-save-edit
            </v-icon>
          </v-btn>
          <v-btn
            v-if="canDelete"
            color="error"
            class="ml-2"
            @click="beforeDelete"
          >
            Xoá tag
            <v-icon right>
              mdi-delete-outline
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="mb-2">
            <v-slide-x-transition
              v-for="error in $store.getters.errors"
              :key="error[0]"
            >
              <v-alert
                dense
                dismissible
                type="error"
              >
                {{ error[0] }}
              </v-alert>
            </v-slide-x-transition>
          </div>
          <v-text-field
            v-model="data.name"
            label="Tên tag"
            flat
            dense
            outlined
            required
            class="d-flex"
            :rules="[rules.required]"
          />
          <v-text-field
            v-model="data.slug"
            :label="(!slug||slugFocus)?'URL tuỳ chỉnh':slug"
            :placeholder="slug"
            flat
            dense
            outlined
            required
            :prefix="baseUrl"
            @focus="slugFocus=true"
            @blur="slugFocus=false"
          />
        </v-card-text>
      </v-card>
    </v-form>
    <ConfirmDialog ref="confirm" />
  </v-container>
</template>
<script>
export default {
  layout: "admin",
  middleware: "authorized",
  meta: {
    auth: {
      permission: "tag.update"
    }
  },
  async asyncData({ app, params, error }) {
    try {
      let { tag } = await app.$axios.$get("/admin/tags/" + params.id);
      return {
        data: tag,
      }
    } catch (err) {
      return error({ statusCode: err.response ? err.response.status : 422, message: err.message || 'Có lỗi xảy ra' })
    }
  },
  data() {
    return {
      valid: false,
      rules: {
        required: v => !!v || 'Không được bỏ trống',
      },
      data: {
        name: null,
        slug: null,
        description: null,
      },
      slug: null,
      slugFocus: false
    };
  },
  computed: {
    watchName() {
      return this.data.name
    },
    baseUrl() {
      return process.env.baseUrl + "/"
    },
    canDelete() {
      return this.$auth.user.permissions.includes("tag.delete")
    }
  },
  watch: {
    watchName: {
      handler() {
        this.generate_slug()
      }
    }
  },
  mounted() {
    this.generate_slug = this.$debounce(this.generate_slug, 200);
  },
  methods: {
    save() {
      this.$axios.patch("/admin/tags/" + this.$route.params.id, this.data)
      .then(() => {
        this.$notifier.showMessage({
          content: 'Lưu thành công!',
          color: 'success',
          right: false
        })
      })
      .catch(() => {
        this.$notifier.showMessage({
          content: 'Có lỗi, vui lòng thử lại',
          color: 'error',
          right: false
        })
      })
    },
    async beforeDelete() {
      if (!this.canDelete) {
        return this.$notifier.showMessage({
          content: 'Bạn không có quyền thực hiện hành động này!',
          color: 'error',
          right: false
        })
      }
      let confirm = await this.$refs.confirm.open('Xoá tag', 'Bạn có chắc muốn xoá tag này? Đây là hành động vĩnh viễn và không thể thay đổi!', { color: 'red' });
      if (confirm) {
        this.deleteItem()
      }
    },
    deleteItem() {
      this.$axios.delete("/admin/tags/" + this.$route.params.id)
      .then(() => {
        this.$router.push({
          name: "admin-tags"
        });
        this.$notifier.showMessage({
          content: 'Xoá thành công',
          color: 'success',
          right: false
        })
      })
      .catch(() => {
        this.$notifier.showMessage({
          content: 'Có lỗi khi xoá, vui lòng thử lại',
          color: 'error',
          right: false
        })
      });
    },
    generate_slug() {
      this.slug = this.$slugify(this.data.name);
    },
  }
};
</script>
