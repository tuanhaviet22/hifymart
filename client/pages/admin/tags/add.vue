<template>
  <v-container>
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-card>
        <v-card-title>
          <span>Thêm Tag</span>
          <v-spacer />
          <v-btn
            :disabled="!valid"
            color="primary"
            @click="save"
          >
            Thêm mới
            <v-icon right>
              mdi-content-save
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
  </v-container>
</template>
<script>
export default {
  layout: "admin",
  middleware: "authorized",
  meta: {
    auth: {
      permission: "tag.create"
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
      this.$axios.post("/admin/tags", this.data)
      .then(res => {
        this.$router.push({
          name: "admin-tags-id",
          params: {
            id: res.data.tag.id
          }
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
    generate_slug() {
      this.slug = this.$slugify(this.data.name);
    },
  }
};
</script>
